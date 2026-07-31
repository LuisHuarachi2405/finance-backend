import { Account } from '../../../generated/prisma/client.js';
import { Money } from '../../../common/value-objects/money.value-object';
import {
  AccountEntity,
  calculateCurrentBalance,
} from '../entities/account.entity';

export function toAccountEntity(account: Account): AccountEntity {
  const initialBalance = new Money(
    account.initialBalance.toNumber(),
    account.currency,
  );

  return {
    id: account.id,
    userId: account.userId,
    name: account.name,
    institution: account.institution,
    accountType: account.accountType,
    initialBalance,
    currentBalance: calculateCurrentBalance(initialBalance),
    status: account.status,
    notes: account.notes,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
  };
}
