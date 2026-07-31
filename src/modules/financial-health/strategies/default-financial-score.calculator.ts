import { Injectable } from '@nestjs/common';
import {
  BUDGET_COMPLIANCE_WEIGHT,
  EXPENSE_GROWTH_WEIGHT,
  SAVINGS_RATE_WEIGHT,
} from '../constants/financial-health.constants';
import { CurrencyFinancialIndicators } from '../entities/financial-health.entity';
import { FinancialScoreCalculator } from '../interfaces/financial-score-calculator.interface';

interface ScoreComponent {
  score: number;
  weight: number;
}

@Injectable()
export class DefaultFinancialScoreCalculator implements FinancialScoreCalculator {
  calculate(
    indicators: CurrencyFinancialIndicators,
    budgetCompliance: number | null,
  ): number | null {
    const components: ScoreComponent[] = [];

    if (indicators.savingsRate !== null) {
      components.push({
        score: this.clamp(50 + indicators.savingsRate * 2),
        weight: SAVINGS_RATE_WEIGHT,
      });
    }

    if (budgetCompliance !== null) {
      components.push({
        score: this.clamp(budgetCompliance),
        weight: BUDGET_COMPLIANCE_WEIGHT,
      });
    }

    if (indicators.expenseGrowth !== null) {
      components.push({
        score: this.clamp(50 - indicators.expenseGrowth),
        weight: EXPENSE_GROWTH_WEIGHT,
      });
    }

    if (components.length === 0) {
      return null;
    }

    const totalWeight = components.reduce((sum, c) => sum + c.weight, 0);
    const weightedSum = components.reduce(
      (sum, c) => sum + c.score * c.weight,
      0,
    );

    return Math.round(weightedSum / totalWeight);
  }

  private clamp(value: number): number {
    return Math.max(0, Math.min(100, value));
  }
}
