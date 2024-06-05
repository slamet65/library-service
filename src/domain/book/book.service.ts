import { Injectable } from '@nestjs/common';
import { CreateBookDto } from '../../utils/dto/book/create-book.dto';
import { UpdateBookDto } from 'src/utils/dto/book/update-book.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Function } from 'src/utils/common/function';

@Injectable()
export class BookService {
    private func: Function = new Function()
    constructor(private prisma: PrismaService) { }
    async createBook(data: CreateBookDto) {
        return await this.prisma.books.create(
            {
                data: data
            }
        );
    }

    async createManyBooks(data: CreateBookDto[]) {
        return await this.prisma.books.createMany({
            data: data
        })
    }

    async list() {
        let books = await this.prisma.books.findMany({
            orderBy: {
                code: 'asc'
            }
        });
        const bookBorrowed = await this.prisma.transactions.groupBy({
            by: 'book_code',
            _count : {
                _all : true
            },
            where: {
                return_date : null
            }
        })

        let result = []
        books.forEach(element => {
            const b = bookBorrowed.find(x => x.book_code === element.code)
            if (b) {
                element.stock -= b._count._all
            }
            result.push(element)
        });

        return result;
    }

    async getOne(id: string) {
        const book = await this.prisma.books.findUnique({
            where: {
                code: id
            }
        });

        const bookBorrowed = await this.prisma.transactions.groupBy({
            by: 'book_code',
            _count : {
                _all : true
            },
            where: {
                return_date : null
            }
        })
        const bb = bookBorrowed.find(x => x.book_code === id)
        if (bb) {
            book.stock -= bb._count._all
        }

        return book
    }
    async updateById(id: string, data: UpdateBookDto) {
        let payload = {};
        if (!this.func.isnull(data.author)) {
            payload["author"] = data.author
        }
        if (!this.func.isnull(data.title)) {
            payload["title"] = data.title
        }
        if (!this.func.isnull(data.stock)) {
            payload["stock"] = data.stock
        }
        return await this.prisma.books.update({
            where: {
                code: id
            },
            data: payload
        });
    }

    async deleteById(id: string) {
        return await this.prisma.books.delete({
            where: {
                code : id
            }
        })
    }
}
