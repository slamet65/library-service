import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createTransactionDto } from 'src/utils/dto/transaction/create-transaction.dto';

@Injectable()
export class TransactionService {
    constructor(private prisma: PrismaService) { }

    async create(payload: createTransactionDto) {
        const now = new Date
        //check book availability
        const book = await this.prisma.books.findUniqueOrThrow({
            where: {
                code: payload.book_code
            }
        })
        const bookInBorrow = await this.prisma.transactions.groupBy({
            by: 'book_code',
            where: {
                book_code: payload.book_code,
                return_date: null 
            },
            _count: {
                _all: true
            }
        })

        if (bookInBorrow.length > 0) {
            if ((book.stock - bookInBorrow[0]._count._all) < 1) {
                throw new Error("Book is not available")
            }
        }

        //check member borrow status
        const borrowed_book = await this.prisma.transactions.findMany({
            where: {
                member_code: payload.member_code,
                return_date: null 
            }
        })

        if (borrowed_book.length >= 2) {
            throw new Error("this user already has 2 book borrowed")
        }
        borrowed_book.forEach(element => {
            if (element.expexted_return < now) {
                throw new Error("this user unable to borrow more book")
            }
        });

        //check member status
        const member = await this.prisma.members.findUnique({
            where: {
                code: payload.member_code
            }
        })

        if (member.penalized_until >= now) {
            throw new Error("this user is under penaltied period")
        }

        let expected_return = new Date()
        expected_return.setDate(now.getDate() + 7)
        return this.prisma.transactions.create({
            data: {
                ...payload,
                borrow_date: now,
                expexted_return: expected_return
            }
        })
    }

    async update(payload: createTransactionDto) {
        const now = new Date
        //check transaction
        const trans = await this.prisma.transactions.findMany({
            where: {
                book_code: payload.book_code,
                member_code: payload.member_code,
                return_date: null
            }, orderBy: {
                expexted_return: 'asc'
            }
        });
        if (trans.length < 1) {
            throw new Error("User is not borrowed this book")
        }
        const t = trans[0]
        //update transaction
        const result = await this.prisma.transactions.update({
            where: {
                id: t.id
            }, data: {
                return_date: now
            }
        })
        //check penalty
        if (t.expexted_return < now) {
            let penalty = new Date()
            penalty.setDate(now.getDate() + 3)
            await this.prisma.members.update({
                where: {
                    code: payload.member_code
                }, data: {
                    penalized_until: penalty
                }
            })
        }
        return result

    }
}
