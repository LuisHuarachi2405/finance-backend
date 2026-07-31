import { Module } from '@nestjs/common';
import { BudgetsModule } from '../budgets/budgets.module';
import { ReportsModule } from '../reports/reports.module';
import { UsersModule } from '../users/users.module';
import { FinancialHealthController } from './controllers/financial-health.controller';
import { FINANCIAL_SCORE_CALCULATOR } from './constants/financial-health.constants';
import { FinancialHealthService } from './services/financial-health.service';
import { DefaultFinancialScoreCalculator } from './strategies/default-financial-score.calculator';

@Module({
  imports: [ReportsModule, BudgetsModule, UsersModule],
  controllers: [FinancialHealthController],
  providers: [
    FinancialHealthService,
    {
      provide: FINANCIAL_SCORE_CALCULATOR,
      useClass: DefaultFinancialScoreCalculator,
    },
  ],
})
export class FinancialHealthModule {}
