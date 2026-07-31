import { Module } from '@nestjs/common';
import { AccountsController } from './controllers/accounts.controller';
import { ACCOUNT_REPOSITORY } from './constants/accounts.constants';
import { PrismaAccountRepository } from './repositories/account.repository';
import { AccountsService } from './services/accounts.service';

@Module({
  controllers: [AccountsController],
  providers: [
    AccountsService,
    { provide: ACCOUNT_REPOSITORY, useClass: PrismaAccountRepository },
  ],
  exports: [AccountsService],
})
export class AccountsModule {}
