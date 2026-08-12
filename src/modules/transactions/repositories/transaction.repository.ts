import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  Transaction,
  TransactionStatus,
} from '../../../generated/prisma/client.js';
import { BalanceAdjustment } from '../entities/transaction.entity';
import {
  CreateTransactionInput,
  ListTransactionsFilter,
  SumAmountFilter,
  TransactionRepository,
  TransactionSortField,
  UpdateTransactionInput,
} from '../interfaces/transaction-repository.interface';

@Injectable()
export class PrismaTransactionRepository implements TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    data: CreateTransactionInput,
    adjustments: BalanceAdjustment[],
  ): Promise<Transaction> {
    return this.prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({ data });

      for (const adjustment of adjustments) {
        await tx.account.update({
          where: { id: adjustment.accountId },
          data: { currentBalance: { increment: adjustment.delta } },
        });
      }

      return transaction;
    });
  }

  findById(id: string): Promise<Transaction | null> {
    return this.prisma.transaction.findUnique({ where: { id } });
  }

  findAllByUser(
    userId: string,
    filter: ListTransactionsFilter,
  ): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: {
        userId,
        type: filter.type,
        status: filter.status,
        categoryId: filter.categoryId,
        ...(filter.accountId && {
          OR: [
            { accountId: filter.accountId },
            { toAccountId: filter.accountId },
          ],
        }),
        ...((filter.dateFrom || filter.dateTo) && {
          transactionDate: {
            gte: filter.dateFrom,
            lte: filter.dateTo,
          },
        }),
        ...((filter.minAmount !== undefined ||
          filter.maxAmount !== undefined) && {
          amount: {
            gte: filter.minAmount,
            lte: filter.maxAmount,
          },
        }),
      },
      orderBy: this.buildOrderBy(filter),
    });
  }

  update(id: string, data: UpdateTransactionInput): Promise<Transaction> {
    return this.prisma.transaction.update({ where: { id }, data });
  }

  updateStatus(
    id: string,
    status: TransactionStatus,
    adjustments: BalanceAdjustment[],
  ): Promise<Transaction> {
    return this.prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.update({
        where: { id },
        data: { status },
      });

      for (const adjustment of adjustments) {
        await tx.account.update({
          where: { id: adjustment.accountId },
          data: { currentBalance: { increment: adjustment.delta } },
        });
      }

      return transaction;
    });
  }

  findByRecurringExpenseId(
    userId: string,
    recurringExpenseId: string,
    dateFrom: Date,
    dateTo: Date,
  ): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: {
        userId,
        recurringExpenseId,
        status: TransactionStatus.ACTIVE,
        transactionDate: { gte: dateFrom, lte: dateTo },
      },
      orderBy: { transactionDate: 'desc' },
    });
  }

  async sumAmount(userId: string, filter: SumAmountFilter): Promise<number> {
    const result = await this.prisma.transaction.aggregate({
      where: {
        userId,
        categoryId: filter.categoryId,
        currency: filter.currency,
        type: filter.type,
        status: filter.status,
        transactionDate: { gte: filter.dateFrom, lte: filter.dateTo },
      },
      _sum: { amount: true },
    });

    return result._sum.amount?.toNumber() ?? 0;
  }

  private buildOrderBy(filter: ListTransactionsFilter) {
    switch (filter.sortBy) {
      case TransactionSortField.AMOUNT:
        return { amount: filter.sortOrder };
      case TransactionSortField.CATEGORY:
        return { category: { name: filter.sortOrder } };
      case TransactionSortField.ACCOUNT:
        return { account: { name: filter.sortOrder } };
      case TransactionSortField.DATE:
      default:
        return { transactionDate: filter.sortOrder };
    }
  }
}
