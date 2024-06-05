import { Body, Controller, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { createTransactionDto } from 'src/utils/dto/transaction/create-transaction.dto';
import { Response } from 'src/utils/http/response';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
    private resp: Response = new Response()
    constructor(private transactionService: TransactionService) { }

    @Post('/borrow')
    async borrow(@Body() body: createTransactionDto) {
        try {
            const data = await this.transactionService.create(body)
            return this.resp.success(200, "successfully add new transaction", data)
        } catch (error) {
            return this.resp.error(400, error.message)
        }
    }

    @Post('/return')
    async returnBook(@Body() body: createTransactionDto) {
        try {
            const data = await this.transactionService.update(body)
            return this.resp.success(200, "successfully update transaction", data)
        } catch (error) {
            return this.resp.error(400, error.message)
        }
    }
}
