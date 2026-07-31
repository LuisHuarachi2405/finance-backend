import { Injectable } from '@nestjs/common';
import { AccountsService } from '../../accounts/services/accounts.service';
import { BudgetEntity } from '../../budgets/entities/budget.entity';
import { ListBudgetsQueryDto } from '../../budgets/dto/list-budgets-query.dto';
import { BudgetsService } from '../../budgets/services/budgets.service';
import { CategoriesService } from '../../categories/services/categories.service';
import { calculateBalanceAdjustments } from '../../transactions/entities/transaction.entity';
import { TransactionSortField } from '../../transactions/interfaces/transaction-repository.interface';
import { TransactionsService } from '../../transactions/services/transactions.service';
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from '../../../generated/prisma/client.js';
import { Money } from '../../../common/value-objects/money.value-object';
import { BalanceHistoryQueryDto } from '../dto/balance-history-query.dto';
import { CashFlowQueryDto } from '../dto/cash-flow-query.dto';
import { CategoryBreakdownQueryDto } from '../dto/category-breakdown-query.dto';
import { PeriodFilterQueryDto } from '../dto/period-filter-query.dto';
import {
  BalanceHistoryReportEntity,
  calculateNumberOfDays,
  calculatePercentage,
  CashFlowGroupBy,
  CashFlowReportEntity,
  CategoryBreakdownReportEntity,
  CategoryTotal,
  CurrencyCashFlow,
  CurrencyCategoryBreakdown,
  CurrencySummary,
  getBucketEnd,
  getBucketStart,
  SummaryReportEntity,
} from '../entities/report.entity';

@Injectable()
export class ReportsService {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly categoriesService: CategoriesService,
    private readonly transactionsService: TransactionsService,
    private readonly budgetsService: BudgetsService,
  ) {}

  async getSummary(
    userId: string,
    query: PeriodFilterQueryDto,
  ): Promise<SummaryReportEntity> {
    const transactions = await this.fetchNonTransferTransactions(userId, query);
    const numberOfDays = calculateNumberOfDays(
      new Date(query.dateFrom),
      new Date(query.dateTo),
    );
    const groups = this.groupByCurrency(transactions);

    const byCurrency: CurrencySummary[] = [];

    for (const [currency, currencyTransactions] of groups) {
      const totalIncome = this.sumByType(
        currencyTransactions,
        TransactionType.INCOME,
      );
      const totalExpenses = this.sumByType(
        currencyTransactions,
        TransactionType.EXPENSE,
      );
      const expensesByCategory = this.sumByCategory(
        currencyTransactions.filter(
          (transaction) => transaction.type === TransactionType.EXPENSE,
        ),
      );
      const highestExpenseCategory = await this.pickHighestCategory(
        userId,
        currency,
        expensesByCategory,
        totalExpenses,
      );

      byCurrency.push({
        currency,
        totalIncome: new Money(totalIncome, currency),
        totalExpenses: new Money(totalExpenses, currency),
        netBalance: new Money(totalIncome - totalExpenses, currency),
        averageDailyExpense: new Money(
          numberOfDays > 0 ? totalExpenses / numberOfDays : 0,
          currency,
        ),
        highestExpenseCategory,
      });
    }

    return {
      dateFrom: new Date(query.dateFrom),
      dateTo: new Date(query.dateTo),
      byCurrency,
    };
  }

  async getCategoryBreakdown(
    userId: string,
    query: CategoryBreakdownQueryDto,
  ): Promise<CategoryBreakdownReportEntity> {
    const transactions = await this.transactionsService.listTransactions(
      userId,
      {
        accountId: query.accountId,
        type: query.type,
        dateFrom: query.dateFrom,
        dateTo: query.dateTo,
        status: TransactionStatus.ACTIVE,
        sortBy: TransactionSortField.DATE,
        sortOrder: 'asc',
      },
    );

    const groups = this.groupByCurrency(transactions);
    const byCurrency: CurrencyCategoryBreakdown[] = [];

    for (const [currency, currencyTransactions] of groups) {
      const totalsByCategory = this.sumByCategory(currencyTransactions);
      const total = Array.from(totalsByCategory.values()).reduce(
        (sum, value) => sum + value,
        0,
      );
      const categories: CategoryTotal[] = [];

      for (const [categoryId, categoryTotal] of totalsByCategory) {
        const categoryName = await this.resolveCategoryName(userId, categoryId);
        categories.push({
          categoryId,
          categoryName,
          total: new Money(categoryTotal, currency),
          percentage: calculatePercentage(categoryTotal, total),
        });
      }

      byCurrency.push({
        currency,
        total: new Money(total, currency),
        categories,
      });
    }

    return {
      type: query.type,
      dateFrom: new Date(query.dateFrom),
      dateTo: new Date(query.dateTo),
      byCurrency,
    };
  }

  async getCashFlow(
    userId: string,
    query: CashFlowQueryDto,
  ): Promise<CashFlowReportEntity> {
    const groupBy: CashFlowGroupBy = query.groupBy ?? 'month';
    const transactions = await this.fetchNonTransferTransactions(userId, query);
    const currencyGroups = this.groupByCurrency(transactions);

    const byCurrency: CurrencyCashFlow[] = [];

    for (const [currency, currencyTransactions] of currencyGroups) {
      const buckets = new Map<
        string,
        { income: number; expenses: number; start: Date }
      >();

      for (const transaction of currencyTransactions) {
        const bucketStart = getBucketStart(
          transaction.transactionDate,
          groupBy,
        );
        const key = bucketStart.toISOString();
        const bucket = buckets.get(key) ?? {
          income: 0,
          expenses: 0,
          start: bucketStart,
        };
        const amount = transaction.amount.toNumber();

        if (transaction.type === TransactionType.INCOME) {
          bucket.income += amount;
        } else {
          bucket.expenses += amount;
        }

        buckets.set(key, bucket);
      }

      const periods = Array.from(buckets.values())
        .sort((a, b) => a.start.getTime() - b.start.getTime())
        .map((bucket) => ({
          periodStart: bucket.start,
          periodEnd: getBucketEnd(bucket.start, groupBy),
          income: new Money(bucket.income, currency),
          expenses: new Money(bucket.expenses, currency),
          net: new Money(bucket.income - bucket.expenses, currency),
        }));

      byCurrency.push({ currency, periods });
    }

    return {
      dateFrom: new Date(query.dateFrom),
      dateTo: new Date(query.dateTo),
      groupBy,
      byCurrency,
    };
  }

  async getBalanceHistory(
    userId: string,
    accountId: string,
    query: BalanceHistoryQueryDto,
  ): Promise<BalanceHistoryReportEntity> {
    const account = await this.accountsService.getAccount(userId, accountId);

    const transactions = await this.transactionsService.listTransactions(
      userId,
      {
        accountId,
        status: TransactionStatus.ACTIVE,
        sortBy: TransactionSortField.DATE,
        sortOrder: 'asc',
      },
    );

    let runningBalance = account.initialBalance.toNumber();

    const allPoints = transactions.map((transaction) => {
      const adjustments = calculateBalanceAdjustments({
        type: transaction.type,
        accountId: transaction.accountId,
        toAccountId: transaction.toAccountId,
        amount: transaction.amount.toNumber(),
      });
      const adjustment = adjustments.find(
        (candidate) => candidate.accountId === accountId,
      );
      runningBalance += adjustment?.delta ?? 0;

      return {
        transactionId: transaction.id,
        date: transaction.transactionDate,
        balance: new Money(runningBalance, account.currency),
      };
    });

    const dateFrom = query.dateFrom ? new Date(query.dateFrom) : undefined;
    const dateTo = query.dateTo ? new Date(query.dateTo) : undefined;

    const points = allPoints.filter((point) => {
      if (dateFrom && point.date < dateFrom) return false;
      if (dateTo && point.date > dateTo) return false;
      return true;
    });

    return { accountId, currency: account.currency, points };
  }

  getBudgetPerformance(
    userId: string,
    query: ListBudgetsQueryDto,
  ): Promise<BudgetEntity[]> {
    return this.budgetsService.listBudgets(userId, query);
  }

  private async fetchNonTransferTransactions(
    userId: string,
    query: PeriodFilterQueryDto,
  ): Promise<Transaction[]> {
    const transactions = await this.transactionsService.listTransactions(
      userId,
      {
        accountId: query.accountId,
        dateFrom: query.dateFrom,
        dateTo: query.dateTo,
        status: TransactionStatus.ACTIVE,
        sortBy: TransactionSortField.DATE,
        sortOrder: 'asc',
      },
    );

    return transactions.filter(
      (transaction) => transaction.type !== TransactionType.TRANSFER,
    );
  }

  private groupByCurrency(
    transactions: Transaction[],
  ): Map<string, Transaction[]> {
    const groups = new Map<string, Transaction[]>();

    for (const transaction of transactions) {
      const group = groups.get(transaction.currency) ?? [];
      group.push(transaction);
      groups.set(transaction.currency, group);
    }

    return groups;
  }

  private sumByType(
    transactions: Transaction[],
    type: TransactionType,
  ): number {
    return transactions
      .filter((transaction) => transaction.type === type)
      .reduce((total, transaction) => total + transaction.amount.toNumber(), 0);
  }

  private sumByCategory(transactions: Transaction[]): Map<string, number> {
    const totals = new Map<string, number>();

    for (const transaction of transactions) {
      if (!transaction.categoryId) {
        continue;
      }

      const current = totals.get(transaction.categoryId) ?? 0;
      totals.set(
        transaction.categoryId,
        current + transaction.amount.toNumber(),
      );
    }

    return totals;
  }

  private async pickHighestCategory(
    userId: string,
    currency: string,
    totals: Map<string, number>,
    totalExpenses: number,
  ): Promise<CategoryTotal | null> {
    let highest: [string, number] | null = null;

    for (const entry of totals) {
      if (!highest || entry[1] > highest[1]) {
        highest = entry;
      }
    }

    if (!highest) {
      return null;
    }

    const [categoryId, total] = highest;
    const categoryName = await this.resolveCategoryName(userId, categoryId);

    return {
      categoryId,
      categoryName,
      total: new Money(total, currency),
      percentage: calculatePercentage(total, totalExpenses),
    };
  }

  private async resolveCategoryName(
    userId: string,
    categoryId: string,
  ): Promise<string> {
    const category = await this.categoriesService.getCategory(
      userId,
      categoryId,
    );
    return category.name;
  }
}
