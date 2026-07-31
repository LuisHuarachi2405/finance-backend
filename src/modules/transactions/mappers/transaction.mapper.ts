import { Transaction } from '../../../generated/prisma/client.js';
import { Money } from '../../../common/value-objects/money.value-object';
import { TransactionEntity } from '../entities/transaction.entity';

export function toTransactionEntity(
  transaction: Transaction,
): TransactionEntity {
  return {
    id: transaction.id,
    userId: transaction.userId,
    accountId: transaction.accountId,
    toAccountId: transaction.toAccountId,
    categoryId: transaction.categoryId,
    type: transaction.type,
    amount: new Money(transaction.amount.toNumber(), transaction.currency),
    transactionDate: transaction.transactionDate,
    notes: transaction.notes,
    status: transaction.status,
    createdAt: transaction.createdAt,
    updatedAt: transaction.updatedAt,
  };
}
