import { Account } from '../../../generated/prisma/client.js';
import { Money } from '../../../common/value-objects/money.value-object';
import { AccountEntity } from '../entities/account.entity';

export function toAccountEntity(account: Account): AccountEntity {
  return {
    id: account.id,
    userId: account.userId,
    name: account.name,
    institution: account.institution,
    accountType: account.accountType,
    initialBalance: new Money(
      account.initialBalance.toNumber(),
      account.currency,
    ),
    currentBalance: new Money(
      account.currentBalance.toNumber(),
      account.currency,
    ),
    status: account.status,
    notes: account.notes,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
  };
}
