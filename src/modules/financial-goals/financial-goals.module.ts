import { Module } from '@nestjs/common';
import { SpendingPlanModule } from '../spending-plan/spending-plan.module';
import { FinancialGoalsController } from './controllers/financial-goals.controller';
import { FINANCIAL_GOAL_REPOSITORY } from './constants/financial-goals.constants';
import { PrismaFinancialGoalRepository } from './repositories/financial-goal.repository';
import { FinancialGoalsService } from './services/financial-goals.service';

@Module({
  imports: [SpendingPlanModule],
  controllers: [FinancialGoalsController],
  providers: [
    FinancialGoalsService,
    {
      provide: FINANCIAL_GOAL_REPOSITORY,
      useClass: PrismaFinancialGoalRepository,
    },
  ],
  exports: [FinancialGoalsService],
})
export class FinancialGoalsModule {}
