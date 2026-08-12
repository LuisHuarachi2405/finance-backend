import { Module } from '@nestjs/common';
import { RecurringExpensesModule } from '../recurring-expenses/recurring-expenses.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { SpendingPlanController } from './controllers/spending-plan.controller';
import { SAVINGS_TARGET_REPOSITORY } from './constants/spending-plan.constants';
import { PrismaSavingsTargetRepository } from './repositories/savings-target.repository';
import { SpendingPlanService } from './services/spending-plan.service';

@Module({
  imports: [TransactionsModule, RecurringExpensesModule],
  controllers: [SpendingPlanController],
  providers: [
    SpendingPlanService,
    {
      provide: SAVINGS_TARGET_REPOSITORY,
      useClass: PrismaSavingsTargetRepository,
    },
  ],
  exports: [SpendingPlanService],
})
export class SpendingPlanModule {}
