import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { StatementImportsService } from '../../statement-imports/services/statement-imports.service';
import { TransactionSortField } from '../../transactions/interfaces/transaction-repository.interface';
import { TransactionsService } from '../../transactions/services/transactions.service';
import { toTransactionEntity } from '../../transactions/mappers/transaction.mapper';
import { ImportedTransactionWithStatement } from '../../statement-imports/interfaces/statement-repository.interface';
import { toImportedTransactionEntity } from '../../statement-imports/mappers/statement.mapper';
import {
  ImportReconciliationStatus,
  ReconciliationStatus,
  Transaction,
  TransactionStatus,
} from '../../../generated/prisma/client.js';
import {
  MATCHING_STRATEGY,
  RECONCILIATION_REPOSITORY,
} from '../constants/reconciliation.constants';
import { ConfirmMatchDto } from '../dto/confirm-match.dto';
import { IgnoreImportedTransactionDto } from '../dto/ignore-imported-transaction.dto';
import { ListHistoryQueryDto } from '../dto/list-history-query.dto';
import { RejectMatchDto } from '../dto/reject-match.dto';
import {
  ReconciliationCandidateEntity,
  ReconciliationMatchEntity,
} from '../entities/reconciliation.entity';
import type { MatchingStrategy } from '../interfaces/matching-strategy.interface';
import type { ReconciliationRepository } from '../interfaces/reconciliation-repository.interface';
import { toReconciliationMatchEntity } from '../mappers/reconciliation.mapper';

@Injectable()
export class ReconciliationService {
  constructor(
    @Inject(RECONCILIATION_REPOSITORY)
    private readonly reconciliationRepository: ReconciliationRepository,
    private readonly statementImportsService: StatementImportsService,
    private readonly transactionsService: TransactionsService,
    @Inject(MATCHING_STRATEGY)
    private readonly matchingStrategy: MatchingStrategy,
  ) {}

  async getCandidates(
    userId: string,
    accountId?: string,
  ): Promise<ReconciliationCandidateEntity[]> {
    const importedTransactions =
      await this.statementImportsService.listUnreconciledImportedTransactions(
        userId,
        accountId,
      );

    if (importedTransactions.length === 0) {
      return [];
    }

    const ignoredImportedIds = new Set(
      await this.reconciliationRepository.findIgnoredImportedTransactionIds(
        userId,
      ),
    );
    const matchedTransactionIds = new Set(
      await this.reconciliationRepository.findMatchedTransactionIds(userId),
    );

    const relevant = importedTransactions.filter(
      (importedTransaction) => !ignoredImportedIds.has(importedTransaction.id),
    );
    const groupedByAccount = this.groupByAccount(relevant);
    const results: ReconciliationCandidateEntity[] = [];

    for (const [groupAccountId, group] of groupedByAccount) {
      const manualTransactions =
        await this.transactionsService.listTransactions(userId, {
          accountId: groupAccountId,
          status: TransactionStatus.ACTIVE,
          sortBy: TransactionSortField.DATE,
          sortOrder: 'desc',
        });
      const eligibleTransactions = manualTransactions.filter(
        (transaction) => !matchedTransactionIds.has(transaction.id),
      );

      for (const importedTransaction of group) {
        const rejectedIds = new Set(
          await this.reconciliationRepository.findRejectedTransactionIds(
            importedTransaction.id,
          ),
        );
        const candidates = eligibleTransactions.filter(
          (transaction) =>
            !rejectedIds.has(transaction.id) &&
            transaction.currency === importedTransaction.currency,
        );
        const bestMatch = this.matchingStrategy.findBestMatch(
          importedTransaction,
          candidates,
        );

        results.push({
          importedTransaction: toImportedTransactionEntity(importedTransaction),
          bestMatch: bestMatch
            ? {
                transaction: toTransactionEntity(bestMatch.transaction),
                score: bestMatch.score,
              }
            : null,
        });
      }
    }

    return results;
  }

  async confirmMatch(
    userId: string,
    dto: ConfirmMatchDto,
  ): Promise<ReconciliationMatchEntity> {
    const importedTransaction =
      await this.statementImportsService.getImportedTransactionWithStatement(
        userId,
        dto.importedTransactionId,
      );
    const transaction = await this.transactionsService.getTransaction(
      userId,
      dto.transactionId,
    );

    this.ensureSameAccountAndCurrency(transaction, importedTransaction);

    const existingImportedMatch =
      await this.reconciliationRepository.findActiveMatchByImportedTransactionId(
        dto.importedTransactionId,
      );

    if (existingImportedMatch) {
      throw new ConflictException(
        'This imported transaction is already matched',
      );
    }

    const existingTransactionMatch =
      await this.reconciliationRepository.findActiveMatchByTransactionId(
        dto.transactionId,
      );

    if (existingTransactionMatch) {
      throw new ConflictException('This transaction is already matched');
    }

    const bestMatch = this.matchingStrategy.findBestMatch(importedTransaction, [
      transaction,
    ]);

    const match = await this.reconciliationRepository.create({
      userId,
      transactionId: dto.transactionId,
      importedTransactionId: dto.importedTransactionId,
      matchScore: bestMatch?.score ?? null,
      status: ReconciliationStatus.MATCHED,
      reviewedAt: new Date(),
    });

    await this.statementImportsService.setReconciliationStatus(
      userId,
      dto.importedTransactionId,
      ImportReconciliationStatus.RECONCILED,
    );

    return toReconciliationMatchEntity(match);
  }

  async rejectMatch(
    userId: string,
    dto: RejectMatchDto,
  ): Promise<ReconciliationMatchEntity> {
    await this.statementImportsService.getImportedTransactionWithStatement(
      userId,
      dto.importedTransactionId,
    );
    await this.transactionsService.getTransaction(userId, dto.transactionId);

    const existingMatched =
      await this.reconciliationRepository.findActiveMatchByImportedTransactionId(
        dto.importedTransactionId,
      );

    if (
      existingMatched &&
      existingMatched.transactionId === dto.transactionId
    ) {
      throw new ConflictException(
        'This pairing is already confirmed as a match',
      );
    }

    const existingRejected = await this.reconciliationRepository.findExisting(
      dto.transactionId,
      dto.importedTransactionId,
      ReconciliationStatus.UNMATCHED,
    );

    if (existingRejected) {
      return toReconciliationMatchEntity(existingRejected);
    }

    const match = await this.reconciliationRepository.create({
      userId,
      transactionId: dto.transactionId,
      importedTransactionId: dto.importedTransactionId,
      matchScore: null,
      status: ReconciliationStatus.UNMATCHED,
      reviewedAt: new Date(),
    });

    return toReconciliationMatchEntity(match);
  }

  async ignoreImportedTransaction(
    userId: string,
    dto: IgnoreImportedTransactionDto,
  ): Promise<ReconciliationMatchEntity> {
    await this.statementImportsService.getImportedTransactionWithStatement(
      userId,
      dto.importedTransactionId,
    );

    const existingMatched =
      await this.reconciliationRepository.findActiveMatchByImportedTransactionId(
        dto.importedTransactionId,
      );

    if (existingMatched) {
      throw new ConflictException(
        'This imported transaction is already matched',
      );
    }

    const existingIgnored =
      await this.reconciliationRepository.findExistingIgnored(
        dto.importedTransactionId,
      );

    if (existingIgnored) {
      return toReconciliationMatchEntity(existingIgnored);
    }

    const match = await this.reconciliationRepository.create({
      userId,
      transactionId: null,
      importedTransactionId: dto.importedTransactionId,
      matchScore: null,
      status: ReconciliationStatus.IGNORED,
      reviewedAt: new Date(),
    });

    return toReconciliationMatchEntity(match);
  }

  async getHistory(
    userId: string,
    query: ListHistoryQueryDto,
  ): Promise<ReconciliationMatchEntity[]> {
    const matches = await this.reconciliationRepository.findAllByUser(userId, {
      status: query.status,
    });

    return matches.map(toReconciliationMatchEntity);
  }

  private ensureSameAccountAndCurrency(
    transaction: Transaction,
    importedTransaction: ImportedTransactionWithStatement,
  ): void {
    if (transaction.accountId !== importedTransaction.statement.accountId) {
      throw new BadRequestException(
        'The transaction and the imported transaction must belong to the same account',
      );
    }

    if (transaction.currency !== importedTransaction.currency) {
      throw new BadRequestException(
        'The transaction and the imported transaction must use the same currency',
      );
    }
  }

  private groupByAccount(
    items: ImportedTransactionWithStatement[],
  ): Map<string, ImportedTransactionWithStatement[]> {
    const groups = new Map<string, ImportedTransactionWithStatement[]>();

    for (const item of items) {
      const group = groups.get(item.statement.accountId) ?? [];
      group.push(item);
      groups.set(item.statement.accountId, group);
    }

    return groups;
  }
}
