import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from '../../../generated/prisma/client.js';
import { BalanceAdjustment } from '../entities/transaction.entity';

export enum TransactionSortField {
  DATE = 'date',
  AMOUNT = 'amount',
  CATEGORY = 'category',
  ACCOUNT = 'account',
}

export const SORT_ORDERS = ['asc', 'desc'] as const;

export type SortOrder = (typeof SORT_ORDERS)[number];

export interface CreateTransactionInput {
  userId: string;
  accountId: string;
  toAccountId?: string | null;
  categoryId?: string | null;
  recurringExpenseId?: string | null;
  type: TransactionType;
  amount: number;
  currency: string;
  transactionDate: Date;
  notes?: string | null;
}

export interface UpdateTransactionInput {
  categoryId?: string | null;
  notes?: string | null;
  transactionDate?: Date;
}

export interface ListTransactionsFilter {
  accountId?: string;
  categoryId?: string;
  type?: TransactionType;
  status: TransactionStatus;
  dateFrom?: Date;
  dateTo?: Date;
  minAmount?: number;
  maxAmount?: number;
  sortBy: TransactionSortField;
  sortOrder: SortOrder;
}

export interface SumAmountFilter {
  categoryId: string;
  currency: string;
  type: TransactionType;
  status: TransactionStatus;
  dateFrom: Date;
  dateTo: Date;
}

export interface TransactionRepository {
  create(
    data: CreateTransactionInput,
    adjustments: BalanceAdjustment[],
  ): Promise<Transaction>;
  findById(id: string): Promise<Transaction | null>;
  findAllByUser(
    userId: string,
    filter: ListTransactionsFilter,
  ): Promise<Transaction[]>;
  update(id: string, data: UpdateTransactionInput): Promise<Transaction>;
  updateStatus(
    id: string,
    status: TransactionStatus,
    adjustments: BalanceAdjustment[],
  ): Promise<Transaction>;
  sumAmount(userId: string, filter: SumAmountFilter): Promise<number>;
  findByRecurringExpenseId(
    userId: string,
    recurringExpenseId: string,
    dateFrom: Date,
    dateTo: Date,
  ): Promise<Transaction[]>;
}
