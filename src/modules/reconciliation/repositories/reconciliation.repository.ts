import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  ReconciliationMatch,
  ReconciliationStatus,
} from '../../../generated/prisma/client.js';
import {
  CreateReconciliationMatchInput,
  ListReconciliationHistoryFilter,
  ReconciliationRepository,
} from '../interfaces/reconciliation-repository.interface';

@Injectable()
export class PrismaReconciliationRepository implements ReconciliationRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateReconciliationMatchInput): Promise<ReconciliationMatch> {
    return this.prisma.reconciliationMatch.create({ data });
  }

  findActiveMatchByImportedTransactionId(
    importedTransactionId: string,
  ): Promise<ReconciliationMatch | null> {
    return this.prisma.reconciliationMatch.findFirst({
      where: { importedTransactionId, status: ReconciliationStatus.MATCHED },
    });
  }

  findActiveMatchByTransactionId(
    transactionId: string,
  ): Promise<ReconciliationMatch | null> {
    return this.prisma.reconciliationMatch.findFirst({
      where: { transactionId, status: ReconciliationStatus.MATCHED },
    });
  }

  findExisting(
    transactionId: string,
    importedTransactionId: string,
    status: ReconciliationStatus,
  ): Promise<ReconciliationMatch | null> {
    return this.prisma.reconciliationMatch.findFirst({
      where: { transactionId, importedTransactionId, status },
    });
  }

  findExistingIgnored(
    importedTransactionId: string,
  ): Promise<ReconciliationMatch | null> {
    return this.prisma.reconciliationMatch.findFirst({
      where: { importedTransactionId, status: ReconciliationStatus.IGNORED },
    });
  }

  async findIgnoredImportedTransactionIds(userId: string): Promise<string[]> {
    const matches = await this.prisma.reconciliationMatch.findMany({
      where: { userId, status: ReconciliationStatus.IGNORED },
      select: { importedTransactionId: true },
    });

    return matches.map((match) => match.importedTransactionId);
  }

  async findMatchedTransactionIds(userId: string): Promise<string[]> {
    const matches = await this.prisma.reconciliationMatch.findMany({
      where: { userId, status: ReconciliationStatus.MATCHED },
      select: { transactionId: true },
    });

    return matches
      .map((match) => match.transactionId)
      .filter((id): id is string => id !== null);
  }

  async findRejectedTransactionIds(
    importedTransactionId: string,
  ): Promise<string[]> {
    const matches = await this.prisma.reconciliationMatch.findMany({
      where: { importedTransactionId, status: ReconciliationStatus.UNMATCHED },
      select: { transactionId: true },
    });

    return matches
      .map((match) => match.transactionId)
      .filter((id): id is string => id !== null);
  }

  findAllByUser(
    userId: string,
    filter: ListReconciliationHistoryFilter,
  ): Promise<ReconciliationMatch[]> {
    return this.prisma.reconciliationMatch.findMany({
      where: { userId, status: filter.status },
      orderBy: { reviewedAt: 'desc' },
    });
  }
}
