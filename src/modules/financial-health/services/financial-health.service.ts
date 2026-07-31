import { Inject, Injectable } from '@nestjs/common';
import { BudgetHealthStatus } from '../../budgets/entities/budget.entity';
import { BudgetsService } from '../../budgets/services/budgets.service';
import { PeriodFilterQueryDto } from '../../reports/dto/period-filter-query.dto';
import {
  CashFlowGroupBy,
  CurrencySummary,
} from '../../reports/entities/report.entity';
import { ReportsService } from '../../reports/services/reports.service';
import { UsersService } from '../../users/services/users.service';
import { FINANCIAL_SCORE_CALCULATOR } from '../constants/financial-health.constants';
import { FinancialHealthHistoryQueryDto } from '../dto/financial-health-history-query.dto';
import {
  calculateCashFlowTrend,
  calculateExpenseGrowth,
  calculatePreviousPeriod,
  calculateRating,
  calculateSavingsRate,
  CurrencyFinancialIndicators,
  enumeratePeriods,
  FinancialHealthHistoryEntry,
  FinancialHealthScoreResult,
  FinancialIndicatorsResult,
} from '../entities/financial-health.entity';
import type { FinancialScoreCalculator } from '../interfaces/financial-score-calculator.interface';

@Injectable()
export class FinancialHealthService {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly budgetsService: BudgetsService,
    private readonly usersService: UsersService,
    @Inject(FINANCIAL_SCORE_CALCULATOR)
    private readonly scoreCalculator: FinancialScoreCalculator,
  ) {}

  async getIndicators(
    userId: string,
    query: PeriodFilterQueryDto,
  ): Promise<FinancialIndicatorsResult> {
    const dateFrom = new Date(query.dateFrom);
    const dateTo = new Date(query.dateTo);
    const previousPeriod = calculatePreviousPeriod(dateFrom, dateTo);

    const [currentSummary, previousSummary, budgetCompliance] =
      await Promise.all([
        this.reportsService.getSummary(userId, query),
        this.reportsService.getSummary(userId, {
          dateFrom: previousPeriod.start.toISOString(),
          dateTo: previousPeriod.end.toISOString(),
          accountId: query.accountId,
        }),
        this.calculateBudgetCompliance(userId, dateFrom, dateTo),
      ]);

    return {
      dateFrom,
      dateTo,
      budgetCompliance,
      byCurrency: this.buildCurrencyIndicators(
        currentSummary.byCurrency,
        previousSummary.byCurrency,
      ),
    };
  }

  async getScore(
    userId: string,
    query: PeriodFilterQueryDto,
  ): Promise<FinancialHealthScoreResult> {
    const indicators = await this.getIndicators(userId, query);
    const user = await this.usersService.getProfile(userId);
    const preferredIndicators =
      indicators.byCurrency.find(
        (currency) => currency.currency === user.preferredCurrency,
      ) ??
      indicators.byCurrency[0] ??
      null;

    if (!preferredIndicators) {
      return {
        dateFrom: indicators.dateFrom,
        dateTo: indicators.dateTo,
        currency: user.preferredCurrency,
        score: null,
        rating: null,
        indicators,
      };
    }

    const score = this.scoreCalculator.calculate(
      preferredIndicators,
      indicators.budgetCompliance,
    );

    return {
      dateFrom: indicators.dateFrom,
      dateTo: indicators.dateTo,
      currency: preferredIndicators.currency,
      score,
      rating: score !== null ? calculateRating(score) : null,
      indicators,
    };
  }

  async getHistory(
    userId: string,
    query: FinancialHealthHistoryQueryDto,
  ): Promise<FinancialHealthHistoryEntry[]> {
    const dateFrom = new Date(query.dateFrom);
    const dateTo = new Date(query.dateTo);
    const groupBy: CashFlowGroupBy = query.groupBy ?? 'month';
    const periods = enumeratePeriods(dateFrom, dateTo, groupBy);

    const entries: FinancialHealthHistoryEntry[] = [];

    for (const period of periods) {
      const result = await this.getScore(userId, {
        dateFrom: period.start.toISOString(),
        dateTo: period.end.toISOString(),
        accountId: query.accountId,
      });

      entries.push({
        periodStart: period.start,
        periodEnd: period.end,
        currency: result.currency,
        score: result.score,
        rating: result.rating,
      });
    }

    return entries;
  }

  private async calculateBudgetCompliance(
    userId: string,
    dateFrom: Date,
    dateTo: Date,
  ): Promise<number | null> {
    const budgets = await this.budgetsService.listBudgets(userId, {
      active: true,
    });
    const overlapping = budgets.filter(
      (budget) => budget.startDate <= dateTo && budget.endDate >= dateFrom,
    );

    if (overlapping.length === 0) {
      return null;
    }

    const compliant = overlapping.filter(
      (budget) => budget.status !== BudgetHealthStatus.EXCEEDED,
    ).length;

    return (compliant / overlapping.length) * 100;
  }

  private buildCurrencyIndicators(
    current: CurrencySummary[],
    previous: CurrencySummary[],
  ): CurrencyFinancialIndicators[] {
    const previousByCurrency = new Map(
      previous.map((summary) => [summary.currency, summary]),
    );

    return current.map((summary) => {
      const previousSummary = previousByCurrency.get(summary.currency) ?? null;
      const income = summary.totalIncome.amount;
      const expenses = summary.totalExpenses.amount;
      const savings = income - expenses;
      const previousNet = previousSummary
        ? previousSummary.netBalance.amount
        : null;
      const previousExpenses = previousSummary
        ? previousSummary.totalExpenses.amount
        : null;

      return {
        currency: summary.currency,
        totalIncome: summary.totalIncome,
        totalExpenses: summary.totalExpenses,
        savings: summary.netBalance,
        savingsRate: calculateSavingsRate(income, savings),
        expenseGrowth: calculateExpenseGrowth(expenses, previousExpenses),
        averageDailyExpense: summary.averageDailyExpense,
        highestExpenseCategory: summary.highestExpenseCategory,
        cashFlowTrend: calculateCashFlowTrend(savings, previousNet),
      };
    });
  }
}
