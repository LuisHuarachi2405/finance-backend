import {
  Account,
  AccountStatus,
  AccountType,
} from '../../../generated/prisma/client.js';

export interface CreateAccountInput {
  userId: string;
  name: string;
  institution?: string | null;
  accountType: AccountType;
  currency: string;
  initialBalance: number;
  notes?: string | null;
}

export interface UpdateAccountInput {
  name?: string;
  institution?: string | null;
  accountType?: AccountType;
  notes?: string | null;
}

export interface AccountRepository {
  create(data: CreateAccountInput): Promise<Account>;
  findById(id: string): Promise<Account | null>;
  findAllByUser(userId: string, status: AccountStatus): Promise<Account[]>;
  update(id: string, data: UpdateAccountInput): Promise<Account>;
  updateStatus(id: string, status: AccountStatus): Promise<Account>;
}
