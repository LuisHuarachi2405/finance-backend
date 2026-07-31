import {
  TransactionStatus,
  TransactionType,
} from '../../../generated/prisma/client.js';
import { Money } from '../../../common/value-objects/money.value-object';

export class TransactionEntity {
  id: string;
  userId: string;
  accountId: string;
  toAccountId: string | null;
  categoryId: string | null;
  type: TransactionType;
  amount: Money;
  transactionDate: Date;
  notes: string | null;
  status: TransactionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface BalanceAdjustment {
  accountId: string;
  delta: number;
}

export function calculateBalanceAdjustments(transaction: {
  type: TransactionType;
  accountId: string;
  toAccountId: string | null;
  amount: number;
}): BalanceAdjustment[] {
  switch (transaction.type) {
    case TransactionType.EXPENSE:
      return [{ accountId: transaction.accountId, delta: -transaction.amount }];
    case TransactionType.INCOME:
      return [{ accountId: transaction.accountId, delta: transaction.amount }];
    case TransactionType.TRANSFER:
      return [
        { accountId: transaction.accountId, delta: -transaction.amount },
        {
          accountId: transaction.toAccountId as string,
          delta: transaction.amount,
        },
      ];
  }
}

export function reverseBalanceAdjustments(
  adjustments: BalanceAdjustment[],
): BalanceAdjustment[] {
  return adjustments.map((adjustment) => ({
    accountId: adjustment.accountId,
    delta: -adjustment.delta,
  }));
}
