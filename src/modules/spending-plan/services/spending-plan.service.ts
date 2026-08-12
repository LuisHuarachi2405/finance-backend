import { Inject, Injectable } from '@nestjs/common';
import { calculatePercentage } from '../../reports/entities/report.entity';
import { RecurringExpensesService } from '../../recurring-expenses/services/recurring-expenses.service';
import { TransactionSortField } from '../../transactions/interfaces/transaction-repository.interface';
import { TransactionsService } from '../../transactions/services/transactions.service';
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from '../../../generated/prisma/client.js';
import { Money } from '../../../common/value-objects/money.value-object';
import {
  DEFAULT_SAVINGS_TARGET_PERCENTAGE,
  SAVINGS_TARGET_REPOSITORY,
} from '../constants/spending-plan.constants';
import { SpendingPlanQueryDto } from '../dto/spending-plan-query.dto';
import { UpdateSavingsTargetDto } from '../dto/update-savings-target.dto';
import {
  CurrencySpendingPlan,
  SavingsTargetEntity,
  SpendingPlanResult,
} from '../entities/spending-plan.entity';
import type { SavingsTargetRepository } from '../interfaces/savings-target-repository.interface';

@Injectable()
export class SpendingPlanService {
  constructor(
    @Inject(SAVINGS_TARGET_REPOSITORY)
    private readonly savingsTargetRepository: SavingsTargetRepository,
    private readonly transactionsService: TransactionsService,
    private readonly recurringExpensesService: RecurringExpensesService,
  ) {}

  async getSpendingPlan(
    userId: string,
    query: SpendingPlanQueryDto,
  ): Promise<SpendingPlanResult> {
    const [transactions, projectedOccurrences, savingsTargetPercentage] =
      await Promise.all([
        this.transactionsService.listTransactions(userId, {
          dateFrom: query.dateFrom,
          dateTo: query.dateTo,
          status: TransactionStatus.ACTIVE,
          sortBy: TransactionSortField.DATE,
          sortOrder: 'asc',
        }),
        this.recurringExpensesService.getProjected(userId, {
          dateFrom: query.dateFrom,
          dateTo: query.dateTo,
        }),
        this.getSavingsTargetPercentage(userId),
      ]);

    const incomeByCurrency = this.sumByCurrency(
      transactions.filter(
        (transaction) => transaction.type === TransactionType.INCOME,
      ),
    );
    const otherExpensesByCurrency = this.sumByCurrency(
      transactions.filter(
        (transaction) =>
          transaction.type === TransactionType.EXPENSE &&
          !transaction.recurringExpenseId,
      ),
    );

    const committedByCurrency = new Map<string, number>();
    for (const occurrence of projectedOccurrences) {
      const current = committedByCurrency.get(occurrence.amount.currency) ?? 0;
      committedByCurrency.set(
        occurrence.amount.currency,
        current + occurrence.amount.amount,
      );
    }

    const currencies = new Set([
      ...incomeByCurrency.keys(),
      ...otherExpensesByCurrency.keys(),
      ...committedByCurrency.keys(),
    ]);

    const byCurrency: CurrencySpendingPlan[] = [];

    for (const currency of currencies) {
      const income = incomeByCurrency.get(currency) ?? 0;
      const committedExpenses = committedByCurrency.get(currency) ?? 0;
      const otherExpenses = otherExpensesByCurrency.get(currency) ?? 0;
      const savingsTargetAmount = income * (savingsTargetPercentage / 100);
      const available =
        income - committedExpenses - otherExpenses - savingsTargetAmount;

      byCurrency.push({
        currency,
        income: new Money(income, currency),
        committedExpenses: new Money(committedExpenses, currency),
        otherExpenses: new Money(otherExpenses, currency),
        savingsTarget: new Money(savingsTargetAmount, currency),
        available: new Money(available, currency),
        committedPercentage: calculatePercentage(committedExpenses, income),
        otherPercentage: calculatePercentage(otherExpenses, income),
        savingsTargetPercentage: calculatePercentage(
          savingsTargetAmount,
          income,
        ),
        availablePercentage: calculatePercentage(available, income),
      });
    }

    return {
      dateFrom: new Date(query.dateFrom),
      dateTo: new Date(query.dateTo),
      savingsTargetPercentage,
      byCurrency,
    };
  }

  async getSavingsTarget(userId: string): Promise<SavingsTargetEntity> {
    const setting = await this.savingsTargetRepository.findByUserId(userId);

    return {
      percentage: setting?.percentage ?? DEFAULT_SAVINGS_TARGET_PERCENTAGE,
      updatedAt: setting?.updatedAt ?? null,
    };
  }

  async updateSavingsTarget(
    userId: string,
    dto: UpdateSavingsTargetDto,
  ): Promise<SavingsTargetEntity> {
    const setting = await this.savingsTargetRepository.upsert(
      userId,
      dto.percentage,
    );

    return {
      percentage: setting.percentage,
      updatedAt: setting.updatedAt,
    };
  }

  private async getSavingsTargetPercentage(userId: string): Promise<number> {
    const setting = await this.savingsTargetRepository.findByUserId(userId);
    return setting?.percentage ?? DEFAULT_SAVINGS_TARGET_PERCENTAGE;
  }

  private sumByCurrency(transactions: Transaction[]): Map<string, number> {
    const totals = new Map<string, number>();

    for (const transaction of transactions) {
      const current = totals.get(transaction.currency) ?? 0;
      totals.set(transaction.currency, current + transaction.amount.toNumber());
    }

    return totals;
  }
}
