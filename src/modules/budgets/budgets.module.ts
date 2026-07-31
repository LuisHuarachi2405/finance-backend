import { Module } from '@nestjs/common';
import { CategoriesModule } from '../categories/categories.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { BudgetsController } from './controllers/budgets.controller';
import { BUDGET_REPOSITORY } from './constants/budgets.constants';
import { PrismaBudgetRepository } from './repositories/budget.repository';
import { BudgetsService } from './services/budgets.service';

@Module({
  imports: [CategoriesModule, TransactionsModule],
  controllers: [BudgetsController],
  providers: [
    BudgetsService,
    { provide: BUDGET_REPOSITORY, useClass: PrismaBudgetRepository },
  ],
  exports: [BudgetsService],
})
export class BudgetsModule {}
