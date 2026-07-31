import { Module } from '@nestjs/common';
import { AccountsModule } from '../accounts/accounts.module';
import { CategoriesModule } from '../categories/categories.module';
import { TransactionsController } from './controllers/transactions.controller';
import { TRANSACTION_REPOSITORY } from './constants/transactions.constants';
import { PrismaTransactionRepository } from './repositories/transaction.repository';
import { TransactionsService } from './services/transactions.service';

@Module({
  imports: [AccountsModule, CategoriesModule],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    { provide: TRANSACTION_REPOSITORY, useClass: PrismaTransactionRepository },
  ],
  exports: [TransactionsService],
})
export class TransactionsModule {}
