import {
  RecurringExpense,
  RecurringExpenseFrequency,
} from '../../../generated/prisma/client.js';

export interface CreateRecurringExpenseInput {
  userId: string;
  categoryId: string;
  accountId: string;
  name: string;
  amount: number;
  currency: string;
  frequency: RecurringExpenseFrequency;
  dayOfMonth?: number | null;
  dayOfWeek?: number | null;
  startDate: Date;
  endDate?: Date | null;
}

export interface UpdateRecurringExpenseInput {
  name?: string;
  amount?: number;
  frequency?: RecurringExpenseFrequency;
  dayOfMonth?: number | null;
  dayOfWeek?: number | null;
  startDate?: Date;
  endDate?: Date | null;
}

export interface ListRecurringExpensesFilter {
  categoryId?: string;
  accountId?: string;
  frequency?: RecurringExpenseFrequency;
  active: boolean;
}

export interface RecurringExpenseRepository {
  create(data: CreateRecurringExpenseInput): Promise<RecurringExpense>;
  findById(id: string): Promise<RecurringExpense | null>;
  findAllByUser(
    userId: string,
    filter: ListRecurringExpensesFilter,
  ): Promise<RecurringExpense[]>;
  update(
    id: string,
    data: UpdateRecurringExpenseInput,
  ): Promise<RecurringExpense>;
  updateActive(id: string, active: boolean): Promise<RecurringExpense>;
}
