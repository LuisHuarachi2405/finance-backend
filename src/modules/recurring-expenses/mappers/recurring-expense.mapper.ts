import { RecurringExpense } from '../../../generated/prisma/client.js';
import { Money } from '../../../common/value-objects/money.value-object';
import {
  CurrentPeriodStatus,
  RecurringExpenseEntity,
} from '../entities/recurring-expense.entity';

export function toRecurringExpenseEntity(
  recurringExpense: RecurringExpense,
  currentPeriod: CurrentPeriodStatus,
): RecurringExpenseEntity {
  return {
    id: recurringExpense.id,
    userId: recurringExpense.userId,
    categoryId: recurringExpense.categoryId,
    accountId: recurringExpense.accountId,
    name: recurringExpense.name,
    amount: new Money(
      recurringExpense.amount.toNumber(),
      recurringExpense.currency,
    ),
    frequency: recurringExpense.frequency,
    dayOfMonth: recurringExpense.dayOfMonth,
    dayOfWeek: recurringExpense.dayOfWeek,
    startDate: recurringExpense.startDate,
    endDate: recurringExpense.endDate,
    active: recurringExpense.active,
    currentPeriod,
    createdAt: recurringExpense.createdAt,
    updatedAt: recurringExpense.updatedAt,
  };
}
