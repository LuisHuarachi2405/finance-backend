import { ReconciliationStatus } from '../../../generated/prisma/client.js';
import { ImportedTransactionEntity } from '../../statement-imports/entities/statement.entity';
import { TransactionEntity } from '../../transactions/entities/transaction.entity';

export class ReconciliationMatchEntity {
  id: string;
  userId: string;
  transactionId: string | null;
  importedTransactionId: string;
  matchScore: number | null;
  status: ReconciliationStatus;
  reviewedAt: Date;
  createdAt: Date;
}

export interface ReconciliationCandidateEntity {
  importedTransaction: ImportedTransactionEntity;
  bestMatch: {
    transaction: TransactionEntity;
    score: number;
  } | null;
}
