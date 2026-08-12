import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AccountsService } from '../../accounts/services/accounts.service';
import { CategoriesService } from '../../categories/services/categories.service';
import { TransactionEntity } from '../../transactions/entities/transaction.entity';
import { toTransactionEntity } from '../../transactions/mappers/transaction.mapper';
import { TransactionsService } from '../../transactions/services/transactions.service';
import {
  CategoryType,
  RecurringExpense,
  RecurringExpenseFrequency,
  TransactionType,
} from '../../../generated/prisma/client.js';
import { Money } from '../../../common/value-objects/money.value-object';
import { RECURRING_EXPENSE_REPOSITORY } from '../constants/recurring-expenses.constants';
import { CreateRecurringExpenseDto } from '../dto/create-recurring-expense.dto';
import { ListRecurringExpensesQueryDto } from '../dto/list-recurring-expenses-query.dto';
import { PayRecurringExpenseDto } from '../dto/pay-recurring-expense.dto';
import { ProjectedQueryDto } from '../dto/projected-query.dto';
import { UpdateRecurringExpenseDto } from '../dto/update-recurring-expense.dto';
import {
  calculatePeriod,
  CurrentPeriodStatus,
  enumerateOccurrences,
  ProjectedOccurrence,
  RecurringExpenseEntity,
} from '../entities/recurring-expense.entity';
import type { RecurringExpenseRepository } from '../interfaces/recurring-expense-repository.interface';
import { toRecurringExpenseEntity } from '../mappers/recurring-expense.mapper';

@Injectable()
export class RecurringExpensesService {
  constructor(
    @Inject(RECURRING_EXPENSE_REPOSITORY)
    private readonly recurringExpenseRepository: RecurringExpenseRepository,
    private readonly categoriesService: CategoriesService,
    private readonly accountsService: AccountsService,
    private readonly transactionsService: TransactionsService,
  ) {}

  async createRecurringExpense(
    userId: string,
    dto: CreateRecurringExpenseDto,
  ): Promise<RecurringExpenseEntity> {
    await this.ensureCategoryIsExpense(userId, dto.categoryId);
    const account = await this.accountsService.getAccount(
      userId,
      dto.accountId,
    );
    this.ensureValidSchedule(dto.frequency, dto.dayOfMonth, dto.dayOfWeek);
    this.ensureValidDateRange(dto.startDate, dto.endDate);

    const recurringExpense = await this.recurringExpenseRepository.create({
      userId,
      categoryId: dto.categoryId,
      accountId: dto.accountId,
      name: dto.name,
      amount: dto.amount,
      currency: account.currency,
      frequency: dto.frequency,
      dayOfMonth: dto.dayOfMonth ?? null,
      dayOfWeek: dto.dayOfWeek ?? null,
      startDate: new Date(dto.startDate),
      endDate: dto.endDate ? new Date(dto.endDate) : null,
    });

    return this.toEntity(userId, recurringExpense);
  }

  async getRecurringExpense(
    userId: string,
    id: string,
  ): Promise<RecurringExpenseEntity> {
    const recurringExpense = await this.findOwnedRecurringExpense(userId, id);
    return this.toEntity(userId, recurringExpense);
  }

  async listRecurringExpenses(
    userId: string,
    query: ListRecurringExpensesQueryDto,
  ): Promise<RecurringExpenseEntity[]> {
    const recurringExpenses =
      await this.recurringExpenseRepository.findAllByUser(userId, {
        categoryId: query.categoryId,
        accountId: query.accountId,
        frequency: query.frequency,
        active: query.active ?? true,
      });

    return Promise.all(
      recurringExpenses.map((recurringExpense) =>
        this.toEntity(userId, recurringExpense),
      ),
    );
  }

  async updateRecurringExpense(
    userId: string,
    id: string,
    dto: UpdateRecurringExpenseDto,
  ): Promise<RecurringExpenseEntity> {
    const existing = await this.findOwnedRecurringExpense(userId, id);
    const nextFrequency = dto.frequency ?? existing.frequency;

    let dayOfMonth = existing.dayOfMonth;
    let dayOfWeek = existing.dayOfWeek;

    if (dto.frequency && dto.frequency !== existing.frequency) {
      this.ensureValidSchedule(nextFrequency, dto.dayOfMonth, dto.dayOfWeek);
      dayOfMonth =
        nextFrequency === RecurringExpenseFrequency.MONTHLY
          ? (dto.dayOfMonth as number)
          : null;
      dayOfWeek =
        nextFrequency === RecurringExpenseFrequency.WEEKLY
          ? (dto.dayOfWeek as number)
          : null;
    } else {
      if (dto.dayOfMonth !== undefined) {
        dayOfMonth = dto.dayOfMonth;
      }
      if (dto.dayOfWeek !== undefined) {
        dayOfWeek = dto.dayOfWeek;
      }
      this.ensureValidSchedule(nextFrequency, dayOfMonth, dayOfWeek);
    }

    const nextStartDate = dto.startDate
      ? new Date(dto.startDate)
      : existing.startDate;
    const nextEndDate =
      dto.endDate !== undefined
        ? dto.endDate
          ? new Date(dto.endDate)
          : null
        : existing.endDate;

    if (dto.startDate || dto.endDate !== undefined) {
      this.ensureValidDateRange(nextStartDate, nextEndDate ?? undefined);
    }

    const recurringExpense = await this.recurringExpenseRepository.update(id, {
      name: dto.name,
      amount: dto.amount,
      frequency: dto.frequency,
      dayOfMonth,
      dayOfWeek,
      startDate: dto.startDate ? nextStartDate : undefined,
      endDate: dto.endDate !== undefined ? nextEndDate : undefined,
    });

    return this.toEntity(userId, recurringExpense);
  }

  async archiveRecurringExpense(
    userId: string,
    id: string,
  ): Promise<RecurringExpenseEntity> {
    const existing = await this.findOwnedRecurringExpense(userId, id);

    if (!existing.active) {
      throw new ConflictException('Recurring expense is already archived');
    }

    const recurringExpense = await this.recurringExpenseRepository.updateActive(
      id,
      false,
    );

    return this.toEntity(userId, recurringExpense);
  }

  async restoreRecurringExpense(
    userId: string,
    id: string,
  ): Promise<RecurringExpenseEntity> {
    const existing = await this.findOwnedRecurringExpense(userId, id);

    if (existing.active) {
      throw new ConflictException('Recurring expense is already active');
    }

    const recurringExpense = await this.recurringExpenseRepository.updateActive(
      id,
      true,
    );

    return this.toEntity(userId, recurringExpense);
  }

  async payRecurringExpense(
    userId: string,
    id: string,
    dto: PayRecurringExpenseDto,
  ): Promise<TransactionEntity> {
    const recurringExpense = await this.findOwnedRecurringExpense(userId, id);

    if (!recurringExpense.active) {
      throw new ConflictException('Cannot pay an archived recurring expense');
    }

    const referenceDate = dto.transactionDate
      ? new Date(dto.transactionDate)
      : new Date();
    const period = calculatePeriod(recurringExpense.frequency, referenceDate);

    const existingPayments =
      await this.transactionsService.findByRecurringExpenseId(
        userId,
        id,
        period.start,
        period.end,
      );

    if (existingPayments.length > 0) {
      throw new ConflictException(
        'This recurring expense has already been paid for the current period',
      );
    }

    const transaction = await this.transactionsService.createTransaction(
      userId,
      {
        type: TransactionType.EXPENSE,
        accountId: recurringExpense.accountId,
        categoryId: recurringExpense.categoryId,
        amount: dto.amount ?? recurringExpense.amount.toNumber(),
        transactionDate: dto.transactionDate ?? referenceDate.toISOString(),
        notes: dto.notes,
      },
      id,
    );

    return toTransactionEntity(transaction);
  }

  async getProjected(
    userId: string,
    query: ProjectedQueryDto,
  ): Promise<ProjectedOccurrence[]> {
    const dateFrom = new Date(query.dateFrom);
    const dateTo = new Date(query.dateTo);
    const recurringExpenses =
      await this.recurringExpenseRepository.findAllByUser(userId, {
        active: true,
      });

    const results: ProjectedOccurrence[] = [];

    for (const recurringExpense of recurringExpenses) {
      const occurrences = enumerateOccurrences(
        recurringExpense,
        dateFrom,
        dateTo,
      );

      for (const dueDate of occurrences) {
        const period = calculatePeriod(recurringExpense.frequency, dueDate);
        const payments =
          await this.transactionsService.findByRecurringExpenseId(
            userId,
            recurringExpense.id,
            period.start,
            period.end,
          );

        results.push({
          recurringExpenseId: recurringExpense.id,
          name: recurringExpense.name,
          amount: new Money(
            recurringExpense.amount.toNumber(),
            recurringExpense.currency,
          ),
          dueDate,
          paid: payments.length > 0,
          transactionId: payments[0]?.id ?? null,
        });
      }
    }

    return results.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  }

  private async findOwnedRecurringExpense(
    userId: string,
    id: string,
  ): Promise<RecurringExpense> {
    const recurringExpense = await this.recurringExpenseRepository.findById(id);

    if (!recurringExpense || recurringExpense.userId !== userId) {
      throw new NotFoundException('Recurring expense not found');
    }

    return recurringExpense;
  }

  private async toEntity(
    userId: string,
    recurringExpense: RecurringExpense,
  ): Promise<RecurringExpenseEntity> {
    const period = calculatePeriod(recurringExpense.frequency, new Date());
    const payments = await this.transactionsService.findByRecurringExpenseId(
      userId,
      recurringExpense.id,
      period.start,
      period.end,
    );

    const currentPeriod: CurrentPeriodStatus = {
      start: period.start,
      end: period.end,
      paid: payments.length > 0,
      transactionId: payments[0]?.id ?? null,
    };

    return toRecurringExpenseEntity(recurringExpense, currentPeriod);
  }

  private async ensureCategoryIsExpense(
    userId: string,
    categoryId: string,
  ): Promise<void> {
    const category = await this.categoriesService.getCategory(
      userId,
      categoryId,
    );

    if (category.type !== CategoryType.EXPENSE) {
      throw new BadRequestException(
        'Recurring expenses can only be associated with expense categories',
      );
    }
  }

  private ensureValidSchedule(
    frequency: RecurringExpenseFrequency,
    dayOfMonth?: number | null,
    dayOfWeek?: number | null,
  ): void {
    if (frequency === RecurringExpenseFrequency.MONTHLY) {
      if (dayOfMonth === undefined || dayOfMonth === null) {
        throw new BadRequestException(
          'dayOfMonth is required for monthly recurring expenses',
        );
      }
      if (dayOfWeek !== undefined && dayOfWeek !== null) {
        throw new BadRequestException(
          'dayOfWeek must not be set for monthly recurring expenses',
        );
      }
      return;
    }

    if (dayOfWeek === undefined || dayOfWeek === null) {
      throw new BadRequestException(
        'dayOfWeek is required for weekly recurring expenses',
      );
    }
    if (dayOfMonth !== undefined && dayOfMonth !== null) {
      throw new BadRequestException(
        'dayOfMonth must not be set for weekly recurring expenses',
      );
    }
  }

  private ensureValidDateRange(
    startDate: Date | string,
    endDate?: Date | string | null,
  ): void {
    if (!endDate) {
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      throw new BadRequestException('End date must be after start date');
    }
  }
}
