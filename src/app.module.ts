import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './domain/book/book.module';
import { PrismaModule } from './prisma/prisma.module';
import { MemberModule } from './domain/member/member.module';
import { TransactionModule } from './domain/transaction/transaction.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [BookModule, PrismaModule, MemberModule, TransactionModule],
})
export class AppModule {}
