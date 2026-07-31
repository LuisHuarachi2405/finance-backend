import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Account, AccountStatus } from '../../../generated/prisma/client.js';
import {
  AccountRepository,
  CreateAccountInput,
  UpdateAccountInput,
} from '../interfaces/account-repository.interface';

@Injectable()
export class PrismaAccountRepository implements AccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateAccountInput): Promise<Account> {
    return this.prisma.account.create({ data });
  }

  findById(id: string): Promise<Account | null> {
    return this.prisma.account.findUnique({ where: { id } });
  }

  findAllByUser(userId: string, status: AccountStatus): Promise<Account[]> {
    return this.prisma.account.findMany({ where: { userId, status } });
  }

  update(id: string, data: UpdateAccountInput): Promise<Account> {
    return this.prisma.account.update({ where: { id }, data });
  }

  updateStatus(id: string, status: AccountStatus): Promise<Account> {
    return this.prisma.account.update({ where: { id }, data: { status } });
  }
}
