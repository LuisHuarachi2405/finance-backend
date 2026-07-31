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
