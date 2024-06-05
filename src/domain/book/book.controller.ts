import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from '../../utils/dto/book/create-book.dto';
import { Response } from 'src/utils/http/response';
import { UpdateBookDto } from 'src/utils/dto/book/update-book.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Book')
@Controller('book')
export class BookController {
    private resp: Response = new Response();
    constructor(private bookService: BookService) { }
    @Post()
    async createBook(@Body() body: CreateBookDto) {
        try {
            const data = await this.bookService.createBook(body);
            return this.resp.success(201, "Successfully create new book!", data);
        } catch (error) {
            return this.resp.error(400, error.message)
        }
    }
    //@Post('/many')
    async createManyBooks(@Body() body: CreateBookDto[]) {
        try {
            const data = await this.bookService.createManyBooks(body);
            return this.resp.success(201, "Successfully create new books!", data);
        } catch (error) {
            return this.resp.error(400, error.message)
        }

    }

    @Get('list')
    async list() {
        try {
            const data = await this.bookService.list();
            return this.resp.success(200, "Book list retrieved!", data);
        } catch (error) {
            return this.resp.error(400, error.message)
        }
    }

    @Get('/:id')
    async getOne(@Param('id') id: string) {
        try {
            const data = await this.bookService.getOne(id);
            return this.resp.success(200, "Retrieved Get One book by ID!", data)
        } catch (error) {
            return this.resp.error(400, error.message)
        }
    }
    @Patch('/:id')
    async updateById(@Param('id') id: string, @Body() body: UpdateBookDto) {
        try {
            const data = await this.bookService.updateById(id, body);
            return this.resp.success(200, "Book data updated!", data);
        } catch (error) {
            return this.resp.error(400, error.message)
        }
    }

    @Delete('/:id')
    async deleteById(@Param('id') id: string) {
        try {
            await this.bookService.deleteById(id)
            return this.resp.success(200, "Book deleted!", null);
        } catch (error) {
            return this.resp.error(400, error.message)
        }
    }
}
