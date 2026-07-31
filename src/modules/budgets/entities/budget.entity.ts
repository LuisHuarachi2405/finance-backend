import { BudgetPeriod } from '../../../generated/prisma/client.js';
import { Money } from '../../../common/value-objects/money.value-object';
import {
  BUDGET_EXCEEDED_THRESHOLD_PERCENTAGE,
  BUDGET_WARNING_THRESHOLD_PERCENTAGE,
} from '../constants/budgets.constants';

export enum BudgetHealthStatus {
  HEALTHY = 'HEALTHY',
  WARNING = 'WARNING',
  EXCEEDED = 'EXCEEDED',
}

export class BudgetEntity {
  id: string;
  userId: string;
  categoryId: string;
  name: string;
  amount: Money;
  spent: Money;
  remaining: Money;
  usagePercentage: number;
  status: BudgetHealthStatus;
  period: BudgetPeriod;
  startDate: Date;
  endDate: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function calculateUsagePercentage(
  amount: number,
  spent: number,
): number {
  return amount > 0 ? (spent / amount) * 100 : 0;
}

export function calculateBudgetStatus(
  usagePercentage: number,
): BudgetHealthStatus {
  if (usagePercentage >= BUDGET_EXCEEDED_THRESHOLD_PERCENTAGE) {
    return BudgetHealthStatus.EXCEEDED;
  }

  if (usagePercentage >= BUDGET_WARNING_THRESHOLD_PERCENTAGE) {
    return BudgetHealthStatus.WARNING;
  }

  return BudgetHealthStatus.HEALTHY;
}
