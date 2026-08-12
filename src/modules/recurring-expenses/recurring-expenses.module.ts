import { Module } from '@nestjs/common';
import { AccountsModule } from '../accounts/accounts.module';
import { CategoriesModule } from '../categories/categories.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { RecurringExpensesController } from './controllers/recurring-expenses.controller';
import { RECURRING_EXPENSE_REPOSITORY } from './constants/recurring-expenses.constants';
import { PrismaRecurringExpenseRepository } from './repositories/recurring-expense.repository';
import { RecurringExpensesService } from './services/recurring-expenses.service';

@Module({
  imports: [CategoriesModule, AccountsModule, TransactionsModule],
  controllers: [RecurringExpensesController],
  providers: [
    RecurringExpensesService,
    {
      provide: RECURRING_EXPENSE_REPOSITORY,
      useClass: PrismaRecurringExpenseRepository,
    },
  ],
  exports: [RecurringExpensesService],
})
export class RecurringExpensesModule {}
