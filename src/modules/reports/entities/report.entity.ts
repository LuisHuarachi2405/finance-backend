import { Money } from '../../../common/value-objects/money.value-object';

export type CashFlowGroupBy = 'day' | 'week' | 'month';

export interface CategoryTotal {
  categoryId: string;
  categoryName: string;
  total: Money;
  percentage: number;
}

export interface CurrencySummary {
  currency: string;
  totalIncome: Money;
  totalExpenses: Money;
  netBalance: Money;
  averageDailyExpense: Money;
  highestExpenseCategory: CategoryTotal | null;
}

export class SummaryReportEntity {
  dateFrom: Date;
  dateTo: Date;
  byCurrency: CurrencySummary[];
}

export interface CurrencyCategoryBreakdown {
  currency: string;
  total: Money;
  categories: CategoryTotal[];
}

export class CategoryBreakdownReportEntity {
  type: string;
  dateFrom: Date;
  dateTo: Date;
  byCurrency: CurrencyCategoryBreakdown[];
}

export interface CashFlowPeriod {
  periodStart: Date;
  periodEnd: Date;
  income: Money;
  expenses: Money;
  net: Money;
}

export interface CurrencyCashFlow {
  currency: string;
  periods: CashFlowPeriod[];
}

export class CashFlowReportEntity {
  dateFrom: Date;
  dateTo: Date;
  groupBy: CashFlowGroupBy;
  byCurrency: CurrencyCashFlow[];
}

export interface BalanceHistoryPoint {
  transactionId: string;
  date: Date;
  balance: Money;
}

export class BalanceHistoryReportEntity {
  accountId: string;
  currency: string;
  points: BalanceHistoryPoint[];
}

export function getBucketStart(date: Date, groupBy: CashFlowGroupBy): Date {
  const start = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );

  if (groupBy === 'month') {
    start.setUTCDate(1);
    return start;
  }

  if (groupBy === 'week') {
    const daysSinceMonday = (start.getUTCDay() + 6) % 7;
    start.setUTCDate(start.getUTCDate() - daysSinceMonday);
    return start;
  }

  return start;
}

export function getBucketEnd(
  bucketStart: Date,
  groupBy: CashFlowGroupBy,
): Date {
  const end = new Date(bucketStart);

  if (groupBy === 'month') {
    end.setUTCMonth(end.getUTCMonth() + 1);
  } else if (groupBy === 'week') {
    end.setUTCDate(end.getUTCDate() + 7);
  } else {
    end.setUTCDate(end.getUTCDate() + 1);
  }

  end.setUTCMilliseconds(end.getUTCMilliseconds() - 1);
  return end;
}

export function calculatePercentage(part: number, total: number): number {
  return total > 0 ? (part / total) * 100 : 0;
}

export function calculateNumberOfDays(dateFrom: Date, dateTo: Date): number {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const days = Math.round(
    (dateTo.getTime() - dateFrom.getTime()) / millisecondsPerDay,
  );
  return Math.max(days + 1, 1);
}
