import { CurrencyFinancialIndicators } from '../entities/financial-health.entity';

export interface FinancialScoreCalculator {
  calculate(
    indicators: CurrencyFinancialIndicators,
    budgetCompliance: number | null,
  ): number | null;
}
