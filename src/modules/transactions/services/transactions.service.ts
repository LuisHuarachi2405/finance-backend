import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AccountsService } from '../../accounts/services/accounts.service';
import { CategoriesService } from '../../categories/services/categories.service';
import {
  CategoryType,
  Transaction,
  TransactionStatus,
  TransactionType,
} from '../../../generated/prisma/client.js';
import { TRANSACTION_REPOSITORY } from '../constants/transactions.constants';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { ListTransactionsQueryDto } from '../dto/list-transactions-query.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import {
  calculateBalanceAdjustments,
  reverseBalanceAdjustments,
} from '../entities/transaction.entity';
import type { TransactionRepository } from '../interfaces/transaction-repository.interface';
import { TransactionSortField } from '../interfaces/transaction-repository.interface';

const CATEGORY_TYPE_BY_TRANSACTION_TYPE: Partial<
  Record<TransactionType, CategoryType>
> = {
  [TransactionType.EXPENSE]: CategoryType.EXPENSE,
  [TransactionType.INCOME]: CategoryType.INCOME,
};

@Injectable()
export class TransactionsService {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepository,
    private readonly accountsService: AccountsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async createTransaction(
    userId: string,
    dto: CreateTransactionDto,
    recurringExpenseId?: string,
  ): Promise<Transaction> {
    const account = await this.accountsService.getAccount(
      userId,
      dto.accountId,
    );

    if (dto.type === TransactionType.TRANSFER) {
      await this.validateTransfer(userId, dto, account.currency);
    } else {
      await this.validateCategoryForType(userId, dto.type, dto.categoryId);
    }

    const adjustments = calculateBalanceAdjustments({
      type: dto.type,
      accountId: dto.accountId,
      toAccountId: dto.toAccountId ?? null,
      amount: dto.amount,
    });

    return this.transactionRepository.create(
      {
        userId,
        accountId: dto.accountId,
        toAccountId: dto.toAccountId,
        categoryId: dto.categoryId,
        recurringExpenseId,
        type: dto.type,
        amount: dto.amount,
        currency: account.currency,
        transactionDate: new Date(dto.transactionDate),
        notes: dto.notes,
      },
      adjustments,
    );
  }

  findByRecurringExpenseId(
    userId: string,
    recurringExpenseId: string,
    dateFrom: Date,
    dateTo: Date,
  ): Promise<Transaction[]> {
    return this.transactionRepository.findByRecurringExpenseId(
      userId,
      recurringExpenseId,
      dateFrom,
      dateTo,
    );
  }

  sumActiveExpenses(
    userId: string,
    categoryId: string,
    currency: string,
    dateFrom: Date,
    dateTo: Date,
  ): Promise<number> {
    return this.transactionRepository.sumAmount(userId, {
      categoryId,
      currency,
      type: TransactionType.EXPENSE,
      status: TransactionStatus.ACTIVE,
      dateFrom,
      dateTo,
    });
  }

  async getTransaction(userId: string, id: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findById(id);

    if (!transaction || transaction.userId !== userId) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  listTransactions(
    userId: string,
    query: ListTransactionsQueryDto,
  ): Promise<Transaction[]> {
    return this.transactionRepository.findAllByUser(userId, {
      accountId: query.accountId,
      categoryId: query.categoryId,
      type: query.type,
      status: query.status ?? TransactionStatus.ACTIVE,
      dateFrom: query.dateFrom ? new Date(query.dateFrom) : undefined,
      dateTo: query.dateTo ? new Date(query.dateTo) : undefined,
      minAmount: query.minAmount,
      maxAmount: query.maxAmount,
      sortBy: query.sortBy ?? TransactionSortField.DATE,
      sortOrder: query.sortOrder ?? 'desc',
    });
  }

  async updateTransaction(
    userId: string,
    id: string,
    dto: UpdateTransactionDto,
  ): Promise<Transaction> {
    const transaction = await this.getTransaction(userId, id);
    this.ensureIsActive(transaction);

    if (dto.categoryId) {
      await this.validateCategoryForType(
        userId,
        transaction.type,
        dto.categoryId,
      );
    }

    return this.transactionRepository.update(id, {
      categoryId: dto.categoryId,
      notes: dto.notes,
      transactionDate: dto.transactionDate
        ? new Date(dto.transactionDate)
        : undefined,
    });
  }

  async archiveTransaction(userId: string, id: string): Promise<Transaction> {
    const transaction = await this.getTransaction(userId, id);

    if (transaction.status === TransactionStatus.ARCHIVED) {
      throw new ConflictException('Transaction is already archived');
    }

    const adjustments = reverseBalanceAdjustments(
      calculateBalanceAdjustments(this.toBalanceAdjustmentInput(transaction)),
    );

    return this.transactionRepository.updateStatus(
      id,
      TransactionStatus.ARCHIVED,
      adjustments,
    );
  }

  async restoreTransaction(userId: string, id: string): Promise<Transaction> {
    const transaction = await this.getTransaction(userId, id);

    if (transaction.status === TransactionStatus.ACTIVE) {
      throw new ConflictException('Transaction is already active');
    }

    const adjustments = calculateBalanceAdjustments(
      this.toBalanceAdjustmentInput(transaction),
    );

    return this.transactionRepository.updateStatus(
      id,
      TransactionStatus.ACTIVE,
      adjustments,
    );
  }

  private async validateTransfer(
    userId: string,
    dto: CreateTransactionDto,
    sourceCurrency: string,
  ): Promise<void> {
    if (!dto.toAccountId) {
      throw new BadRequestException('Transfers require a destination account');
    }

    if (dto.toAccountId === dto.accountId) {
      throw new BadRequestException(
        'Transfers must involve two different accounts',
      );
    }

    if (dto.categoryId) {
      throw new BadRequestException('Transfers cannot have a category');
    }

    const destinationAccount = await this.accountsService.getAccount(
      userId,
      dto.toAccountId,
    );

    if (destinationAccount.currency !== sourceCurrency) {
      throw new BadRequestException(
        'Transfers between accounts with different currencies are not supported',
      );
    }
  }

  private async validateCategoryForType(
    userId: string,
    type: TransactionType,
    categoryId?: string,
  ): Promise<void> {
    if (!categoryId) {
      throw new BadRequestException(
        'A category is required for expense and income transactions',
      );
    }

    const category = await this.categoriesService.getCategory(
      userId,
      categoryId,
    );
    const expectedCategoryType = CATEGORY_TYPE_BY_TRANSACTION_TYPE[type];

    if (category.type !== expectedCategoryType) {
      throw new BadRequestException(
        `Category type must match the transaction type (${type})`,
      );
    }
  }

  private ensureIsActive(transaction: Transaction): void {
    if (transaction.status === TransactionStatus.ARCHIVED) {
      throw new ConflictException('Archived transactions cannot be modified');
    }
  }

  private toBalanceAdjustmentInput(transaction: Transaction): {
    type: TransactionType;
    accountId: string;
    toAccountId: string | null;
    amount: number;
  } {
    return {
      type: transaction.type,
      accountId: transaction.accountId,
      toAccountId: transaction.toAccountId,
      amount: transaction.amount.toNumber(),
    };
  }
}
