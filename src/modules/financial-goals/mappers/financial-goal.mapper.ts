import { FinancialGoal } from '../../../generated/prisma/client.js';
import { Money } from '../../../common/value-objects/money.value-object';
import { FinancialGoalEntity } from '../entities/financial-goal.entity';

export function toFinancialGoalEntity(
  goal: FinancialGoal,
): FinancialGoalEntity {
  return {
    id: goal.id,
    userId: goal.userId,
    name: goal.name,
    targetAmount: new Money(goal.targetAmount.toNumber(), goal.currency),
    currentSavedAmount: new Money(
      goal.currentSavedAmount.toNumber(),
      goal.currency,
    ),
    targetDate: goal.targetDate,
    priority: goal.priority,
    status: goal.status,
    notes: goal.notes,
    createdAt: goal.createdAt,
    updatedAt: goal.updatedAt,
  };
}
