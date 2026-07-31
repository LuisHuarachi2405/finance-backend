import { Budget } from '../../../generated/prisma/client.js';
import { Money } from '../../../common/value-objects/money.value-object';
import {
  BudgetEntity,
  calculateBudgetStatus,
  calculateUsagePercentage,
} from '../entities/budget.entity';

export function toBudgetEntity(
  budget: Budget,
  spentAmount: number,
): BudgetEntity {
  const amount = budget.amount.toNumber();
  const usagePercentage = calculateUsagePercentage(amount, spentAmount);

  return {
    id: budget.id,
    userId: budget.userId,
    categoryId: budget.categoryId,
    name: budget.name,
    amount: new Money(amount, budget.currency),
    spent: new Money(spentAmount, budget.currency),
    remaining: new Money(amount - spentAmount, budget.currency),
    usagePercentage,
    status: calculateBudgetStatus(usagePercentage),
    period: budget.period,
    startDate: budget.startDate,
    endDate: budget.endDate,
    active: budget.active,
    createdAt: budget.createdAt,
    updatedAt: budget.updatedAt,
  };
}
