import { ReconciliationMatch } from '../../../generated/prisma/client.js';
import { ReconciliationMatchEntity } from '../entities/reconciliation.entity';

export function toReconciliationMatchEntity(
  match: ReconciliationMatch,
): ReconciliationMatchEntity {
  return {
    id: match.id,
    userId: match.userId,
    transactionId: match.transactionId,
    importedTransactionId: match.importedTransactionId,
    matchScore: match.matchScore,
    status: match.status,
    reviewedAt: match.reviewedAt,
    createdAt: match.createdAt,
  };
}
