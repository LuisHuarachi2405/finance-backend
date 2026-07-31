import { Money } from '../../../common/value-objects/money.value-object';
import {
  CashFlowGroupBy,
  CategoryTotal,
  getBucketEnd,
  getBucketStart,
} from '../../reports/entities/report.entity';
import {
  CASH_FLOW_TREND_TOLERANCE_PERCENT,
  SCORE_THRESHOLD_EXCELLENT,
  SCORE_THRESHOLD_GOOD,
  SCORE_THRESHOLD_NEEDS_ATTENTION,
} from '../constants/financial-health.constants';

export enum FinancialHealthRating {
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  NEEDS_ATTENTION = 'NEEDS_ATTENTION',
  CRITICAL = 'CRITICAL',
}

export type CashFlowTrend = 'IMPROVING' | 'DECLINING' | 'STABLE';

export interface CurrencyFinancialIndicators {
  currency: string;
  totalIncome: Money;
  totalExpenses: Money;
  savings: Money;
  savingsRate: number | null;
  expenseGrowth: number | null;
  averageDailyExpense: Money;
  highestExpenseCategory: CategoryTotal | null;
  cashFlowTrend: CashFlowTrend;
}

export interface FinancialIndicatorsResult {
  dateFrom: Date;
  dateTo: Date;
  budgetCompliance: number | null;
  byCurrency: CurrencyFinancialIndicators[];
}

export interface FinancialHealthScoreResult {
  dateFrom: Date;
  dateTo: Date;
  currency: string;
  score: number | null;
  rating: FinancialHealthRating | null;
  indicators: FinancialIndicatorsResult;
}

export interface FinancialHealthHistoryEntry {
  periodStart: Date;
  periodEnd: Date;
  currency: string;
  score: number | null;
  rating: FinancialHealthRating | null;
}

export function calculateSavingsRate(
  income: number,
  savings: number,
): number | null {
  return income === 0 ? null : (savings / income) * 100;
}

export function calculateExpenseGrowth(
  currentExpenses: number,
  previousExpenses: number | null,
): number | null {
  if (previousExpenses === null || previousExpenses === 0) {
    return null;
  }

  return ((currentExpenses - previousExpenses) / previousExpenses) * 100;
}

export function calculateCashFlowTrend(
  currentNet: number,
  previousNet: number | null,
): CashFlowTrend {
  if (previousNet === null) {
    return 'STABLE';
  }

  if (previousNet === 0) {
    if (currentNet === 0) {
      return 'STABLE';
    }

    return currentNet > 0 ? 'IMPROVING' : 'DECLINING';
  }

  const changePercent =
    ((currentNet - previousNet) / Math.abs(previousNet)) * 100;

  if (Math.abs(changePercent) <= CASH_FLOW_TREND_TOLERANCE_PERCENT) {
    return 'STABLE';
  }

  return changePercent > 0 ? 'IMPROVING' : 'DECLINING';
}

export function calculateRating(score: number): FinancialHealthRating {
  if (score >= SCORE_THRESHOLD_EXCELLENT) {
    return FinancialHealthRating.EXCELLENT;
  }

  if (score >= SCORE_THRESHOLD_GOOD) {
    return FinancialHealthRating.GOOD;
  }

  if (score >= SCORE_THRESHOLD_NEEDS_ATTENTION) {
    return FinancialHealthRating.NEEDS_ATTENTION;
  }

  return FinancialHealthRating.CRITICAL;
}

export function calculatePreviousPeriod(
  dateFrom: Date,
  dateTo: Date,
): { start: Date; end: Date } {
  const periodLengthMs = dateTo.getTime() - dateFrom.getTime();
  const end = new Date(dateFrom.getTime() - 1);
  const start = new Date(end.getTime() - periodLengthMs);

  return { start, end };
}

export function enumeratePeriods(
  dateFrom: Date,
  dateTo: Date,
  groupBy: CashFlowGroupBy,
): Array<{ start: Date; end: Date }> {
  const periods: Array<{ start: Date; end: Date }> = [];
  let cursor = getBucketStart(dateFrom, groupBy);

  while (cursor <= dateTo) {
    const end = getBucketEnd(cursor, groupBy);
    periods.push({ start: cursor, end });
    cursor = new Date(end.getTime() + 1);
  }

  return periods;
}
