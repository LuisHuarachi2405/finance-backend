import {
  AccountStatus,
  AccountType,
} from '../../../generated/prisma/client.js';
import { Money } from '../../../common/value-objects/money.value-object';

export class AccountEntity {
  id: string;
  userId: string;
  name: string;
  institution: string | null;
  accountType: AccountType;
  initialBalance: Money;
  currentBalance: Money;
  status: AccountStatus;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export function calculateCurrentBalance(initialBalance: Money): Money {
  // The Transactions module does not exist yet, so there are no movements to
  // apply on top of the initial balance (Decision 004).
  return initialBalance;
}
