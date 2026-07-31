import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Account, AccountStatus } from '../../../generated/prisma/client.js';
import { ACCOUNT_REPOSITORY } from '../constants/accounts.constants';
import { CreateAccountDto } from '../dto/create-account.dto';
import { UpdateAccountDto } from '../dto/update-account.dto';
import type { AccountRepository } from '../interfaces/account-repository.interface';

@Injectable()
export class AccountsService {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepository,
  ) {}

  createAccount(userId: string, dto: CreateAccountDto): Promise<Account> {
    return this.accountRepository.create({ userId, ...dto });
  }

  async getAccount(userId: string, id: string): Promise<Account> {
    const account = await this.accountRepository.findById(id);

    if (!account || account.userId !== userId) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  listAccounts(
    userId: string,
    status: AccountStatus = AccountStatus.ACTIVE,
  ): Promise<Account[]> {
    return this.accountRepository.findAllByUser(userId, status);
  }

  async updateAccount(
    userId: string,
    id: string,
    dto: UpdateAccountDto,
  ): Promise<Account> {
    await this.getAccount(userId, id);
    return this.accountRepository.update(id, dto);
  }

  async archiveAccount(userId: string, id: string): Promise<Account> {
    await this.getAccount(userId, id);
    return this.accountRepository.updateStatus(id, AccountStatus.ARCHIVED);
  }

  async restoreAccount(userId: string, id: string): Promise<Account> {
    await this.getAccount(userId, id);
    return this.accountRepository.updateStatus(id, AccountStatus.ACTIVE);
  }
}
