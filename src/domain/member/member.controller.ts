import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MemberService } from './member.service';
import { Response } from 'src/utils/http/response';
import { createMemberDto } from 'src/utils/dto/member/create-member.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Member')
@Controller('member')
export class MemberController {
    private resp: Response = new Response();
    constructor(private memberService: MemberService) { }

    @Post()
    async create(@Body() body: createMemberDto) {
        try {
            const data = await this.memberService.create(body);
            return this.resp.success(201, "Successfully create new member!", data)
        } catch (error) {
            return this.resp.error(400, error.message)
        }
    }

    //@Post('/many')
    async createMany(@Body() body: createMemberDto[]) {
        try {
            const data = await this.memberService.createMany(body);
            return this.resp.success(201, "Successfully create new members!", data)
        } catch (error) {
            return this.resp.error(400, error.message)
        }
    }

    @Get()
    async list() {
        try {
            const data = await this.memberService.list();
            return this.resp.success(200, "Member data retrieved!", data);
        } catch (error) {
            return this.resp.error(400, error.message)
        }
    }

    @Get('/:id')
    async getOne(@Param('id') id: string) {
        try {
            const data = await this.memberService.getOne(id);
            return this.resp.success(200, "Member data retrieved!", data);
        } catch (error) {
            return this.resp.error(400, error.message)
        }
    }
}
