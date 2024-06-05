import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createMemberDto } from 'src/utils/dto/member/create-member.dto';

@Injectable()
export class MemberService {
    constructor(private prisma: PrismaService) { }

    async create(data: createMemberDto) {
        return await this.prisma.members.create({
            data: data
        });
    }

    async createMany(data: createMemberDto[]) {
        return await this.prisma.members.createMany({
            data: data
        });
    }

    async list() {
        const member = await this.prisma.members.findMany({
            orderBy: {
                code: "asc"
            }
        });
        const borrowedBooks = await this.prisma.transactions.groupBy({
            by: 'member_code',
            _count: {
                _all: true
            },
            where: {
                return_date: null
            }
        })
        let members = []
        member.forEach(element => {
            let m = borrowedBooks.find(x => x.member_code === element.code)
            if (m) {
                element["book_count"] = m._count._all
            } else {
                element["book_count"] = 0
            }
            members.push(element)
        });
        return members
    }

    async getOne(id: string) {
        let member = await this.prisma.members.findUnique({
            where: {
                code: id
            }
        })
        const borrowedBook = await this.prisma.transactions.groupBy({
            by: 'member_code',
            _count: {
                _all: true
            },
            where: {
                AND: [
                    {
                        return_date: null
                    },
                    {
                        member_code: id
                    }]
            }
        })
        if (borrowedBook.length > 0) {
            member["book_count"] = borrowedBook[0]._count._all
        } else {
            member["book_count"] = 0
        }
        return member;
    }
}
