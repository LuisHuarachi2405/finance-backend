import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { AuthenticatedUser } from '../../auth/decorators/current-user.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateAccountDto } from '../dto/create-account.dto';
import { ListAccountsQueryDto } from '../dto/list-accounts-query.dto';
import { UpdateAccountDto } from '../dto/update-account.dto';
import { AccountEntity } from '../entities/account.entity';
import { toAccountEntity } from '../mappers/account.mapper';
import { AccountsService } from '../services/accounts.service';

@ApiTags('accounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @ApiOperation({ summary: 'Create an account' })
  async createAccount(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateAccountDto,
  ): Promise<AccountEntity> {
    const account = await this.accountsService.createAccount(user.id, dto);
    return toAccountEntity(account);
  }

  @Get()
  @ApiOperation({ summary: 'List accounts owned by the authenticated user' })
  async listAccounts(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListAccountsQueryDto,
  ): Promise<AccountEntity[]> {
    const accounts = await this.accountsService.listAccounts(
      user.id,
      query.status,
    );
    return accounts.map(toAccountEntity);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an account by id' })
  async getAccount(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<AccountEntity> {
    const account = await this.accountsService.getAccount(user.id, id);
    return toAccountEntity(account);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an account' })
  async updateAccount(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateAccountDto,
  ): Promise<AccountEntity> {
    const account = await this.accountsService.updateAccount(user.id, id, dto);
    return toAccountEntity(account);
  }

  @Patch(':id/archive')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Archive an account' })
  async archiveAccount(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<AccountEntity> {
    const account = await this.accountsService.archiveAccount(user.id, id);
    return toAccountEntity(account);
  }

  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore an archived account' })
  async restoreAccount(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<AccountEntity> {
    const account = await this.accountsService.restoreAccount(user.id, id);
    return toAccountEntity(account);
  }
}
