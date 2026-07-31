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
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { ListTransactionsQueryDto } from '../dto/list-transactions-query.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { TransactionEntity } from '../entities/transaction.entity';
import { toTransactionEntity } from '../mappers/transaction.mapper';
import { TransactionsService } from '../services/transactions.service';

@ApiTags('transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a transaction' })
  async createTransaction(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateTransactionDto,
  ): Promise<TransactionEntity> {
    const transaction = await this.transactionsService.createTransaction(
      user.id,
      dto,
    );
    return toTransactionEntity(transaction);
  }

  @Get()
  @ApiOperation({
    summary: 'List transactions owned by the authenticated user',
  })
  async listTransactions(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListTransactionsQueryDto,
  ): Promise<TransactionEntity[]> {
    const transactions = await this.transactionsService.listTransactions(
      user.id,
      query,
    );
    return transactions.map(toTransactionEntity);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a transaction by id' })
  async getTransaction(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<TransactionEntity> {
    const transaction = await this.transactionsService.getTransaction(
      user.id,
      id,
    );
    return toTransactionEntity(transaction);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a transaction' })
  async updateTransaction(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateTransactionDto,
  ): Promise<TransactionEntity> {
    const transaction = await this.transactionsService.updateTransaction(
      user.id,
      id,
      dto,
    );
    return toTransactionEntity(transaction);
  }

  @Patch(':id/archive')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Archive a transaction' })
  async archiveTransaction(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<TransactionEntity> {
    const transaction = await this.transactionsService.archiveTransaction(
      user.id,
      id,
    );
    return toTransactionEntity(transaction);
  }

  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore an archived transaction' })
  async restoreTransaction(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<TransactionEntity> {
    const transaction = await this.transactionsService.restoreTransaction(
      user.id,
      id,
    );
    return toTransactionEntity(transaction);
  }
}
