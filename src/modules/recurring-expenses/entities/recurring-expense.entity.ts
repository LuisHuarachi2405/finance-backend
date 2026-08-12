import { RecurringExpenseFrequency } from '../../../generated/prisma/client.js';
import { Money } from '../../../common/value-objects/money.value-object';

export interface CurrentPeriodStatus {
  start: Date;
  end: Date;
  paid: boolean;
  transactionId: string | null;
}

export class RecurringExpenseEntity {
  id: string;
  userId: string;
  categoryId: string;
  accountId: string;
  name: string;
  amount: Money;
  frequency: RecurringExpenseFrequency;
  dayOfMonth: number | null;
  dayOfWeek: number | null;
  startDate: Date;
  endDate: Date | null;
  active: boolean;
  currentPeriod: CurrentPeriodStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectedOccurrence {
  recurringExpenseId: string;
  name: string;
  amount: Money;
  dueDate: Date;
  paid: boolean;
  transactionId: string | null;
}

export interface RecurringExpenseSchedule {
  frequency: RecurringExpenseFrequency;
  dayOfMonth: number | null;
  dayOfWeek: number | null;
  startDate: Date;
  endDate: Date | null;
}

export function calculatePeriod(
  frequency: RecurringExpenseFrequency,
  referenceDate: Date,
): { start: Date; end: Date } {
  if (frequency === RecurringExpenseFrequency.MONTHLY) {
    const start = new Date(
      Date.UTC(referenceDate.getUTCFullYear(), referenceDate.getUTCMonth(), 1),
    );
    const end = new Date(
      Date.UTC(
        referenceDate.getUTCFullYear(),
        referenceDate.getUTCMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      ),
    );
    return { start, end };
  }

  const start = new Date(
    Date.UTC(
      referenceDate.getUTCFullYear(),
      referenceDate.getUTCMonth(),
      referenceDate.getUTCDate(),
    ),
  );
  start.setUTCDate(start.getUTCDate() - start.getUTCDay());
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 6);
  end.setUTCHours(23, 59, 59, 999);

  return { start, end };
}

export function enumerateOccurrences(
  schedule: RecurringExpenseSchedule,
  dateFrom: Date,
  dateTo: Date,
): Date[] {
  const occurrences: Date[] = [];
  const rangeStart =
    schedule.startDate > dateFrom ? schedule.startDate : dateFrom;
  const rangeEnd =
    schedule.endDate && schedule.endDate < dateTo ? schedule.endDate : dateTo;

  if (rangeStart > rangeEnd) {
    return occurrences;
  }

  if (schedule.frequency === RecurringExpenseFrequency.MONTHLY) {
    let cursor = new Date(
      Date.UTC(rangeStart.getUTCFullYear(), rangeStart.getUTCMonth(), 1),
    );
    const lastMonth = new Date(
      Date.UTC(rangeEnd.getUTCFullYear(), rangeEnd.getUTCMonth(), 1),
    );

    while (cursor <= lastMonth) {
      const daysInMonth = new Date(
        Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 0),
      ).getUTCDate();
      const day = Math.min(schedule.dayOfMonth ?? 1, daysInMonth);
      const occurrence = new Date(
        Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth(), day),
      );

      if (occurrence >= rangeStart && occurrence <= rangeEnd) {
        occurrences.push(occurrence);
      }

      cursor = new Date(
        Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 1),
      );
    }

    return occurrences;
  }

  const cursor = new Date(
    Date.UTC(
      rangeStart.getUTCFullYear(),
      rangeStart.getUTCMonth(),
      rangeStart.getUTCDate(),
    ),
  );

  while (cursor <= rangeEnd) {
    if (cursor.getUTCDay() === (schedule.dayOfWeek ?? 0)) {
      occurrences.push(new Date(cursor));
    }

    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return occurrences;
}
