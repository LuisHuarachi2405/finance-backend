import {
  ReconciliationMatch,
  ReconciliationStatus,
} from '../../../generated/prisma/client.js';

export interface CreateReconciliationMatchInput {
  userId: string;
  transactionId?: string | null;
  importedTransactionId: string;
  matchScore?: number | null;
  status: ReconciliationStatus;
  reviewedAt: Date;
}

export interface ListReconciliationHistoryFilter {
  status?: ReconciliationStatus;
}

export interface ReconciliationRepository {
  create(data: CreateReconciliationMatchInput): Promise<ReconciliationMatch>;
  findActiveMatchByImportedTransactionId(
    importedTransactionId: string,
  ): Promise<ReconciliationMatch | null>;
  findActiveMatchByTransactionId(
    transactionId: string,
  ): Promise<ReconciliationMatch | null>;
  findExisting(
    transactionId: string,
    importedTransactionId: string,
    status: ReconciliationStatus,
  ): Promise<ReconciliationMatch | null>;
  findExistingIgnored(
    importedTransactionId: string,
  ): Promise<ReconciliationMatch | null>;
  findIgnoredImportedTransactionIds(userId: string): Promise<string[]>;
  findMatchedTransactionIds(userId: string): Promise<string[]>;
  findRejectedTransactionIds(importedTransactionId: string): Promise<string[]>;
  findAllByUser(
    userId: string,
    filter: ListReconciliationHistoryFilter,
  ): Promise<ReconciliationMatch[]>;
}
