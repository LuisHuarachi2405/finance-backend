import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  ImportedTransaction,
  ImportReconciliationStatus,
  Statement,
} from '../../../generated/prisma/client.js';
import {
  CreateStatementInput,
  ImportedTransactionWithStatement,
  ListStatementsFilter,
  StatementRepository,
} from '../interfaces/statement-repository.interface';

@Injectable()
export class PrismaStatementRepository implements StatementRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateStatementInput): Promise<Statement> {
    const { importedTransactions, ...statementData } = data;

    return this.prisma.statement.create({
      data: {
        ...statementData,
        importedTransactions: { create: importedTransactions },
      },
    });
  }

  findById(id: string): Promise<Statement | null> {
    return this.prisma.statement.findUnique({ where: { id } });
  }

  findByFileHash(
    userId: string,
    accountId: string,
    fileHash: string,
  ): Promise<Statement | null> {
    return this.prisma.statement.findUnique({
      where: { userId_accountId_fileHash: { userId, accountId, fileHash } },
    });
  }

  findAllByUser(
    userId: string,
    filter: ListStatementsFilter,
  ): Promise<Statement[]> {
    return this.prisma.statement.findMany({
      where: {
        userId,
        accountId: filter.accountId,
        provider: filter.provider,
        status: filter.status,
      },
      orderBy: { importedAt: 'desc' },
    });
  }

  findTransactionsByStatementId(
    statementId: string,
  ): Promise<ImportedTransaction[]> {
    return this.prisma.importedTransaction.findMany({
      where: { statementId },
      orderBy: { transactionDate: 'asc' },
    });
  }

  findImportedTransactionWithStatement(
    id: string,
  ): Promise<ImportedTransactionWithStatement | null> {
    return this.prisma.importedTransaction.findUnique({
      where: { id },
      include: { statement: true },
    });
  }

  findUnreconciledImportedTransactions(
    userId: string,
    accountId?: string,
  ): Promise<ImportedTransactionWithStatement[]> {
    return this.prisma.importedTransaction.findMany({
      where: {
        reconciliationStatus: ImportReconciliationStatus.UNRECONCILED,
        statement: { userId, accountId },
      },
      include: { statement: true },
      orderBy: { transactionDate: 'asc' },
    });
  }

  async updateImportedTransactionReconciliationStatus(
    id: string,
    status: ImportReconciliationStatus,
  ): Promise<void> {
    await this.prisma.importedTransaction.update({
      where: { id },
      data: { reconciliationStatus: status },
    });
  }
}
