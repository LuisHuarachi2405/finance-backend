import {
  ImportFileFormat,
  ImportProvider,
  ImportReconciliationStatus,
  ImportStatus,
} from '../../../generated/prisma/client.js';
import { Money } from '../../../common/value-objects/money.value-object';
import { ParsedRowError } from '../interfaces/statement-parser.interface';

export class StatementEntity {
  id: string;
  userId: string;
  accountId: string;
  provider: ImportProvider;
  fileFormat: ImportFileFormat;
  fileName: string;
  status: ImportStatus;
  transactionCount: number;
  errorMessage: string | null;
  importedAt: Date;
}

export class ImportedTransactionEntity {
  id: string;
  statementId: string;
  externalId: string | null;
  transactionDate: Date;
  description: string;
  amount: Money;
  reference: string | null;
  rawData: Record<string, string>;
  reconciliationStatus: ImportReconciliationStatus;
  createdAt: Date;
}

export interface StatementPreviewTransaction {
  provider: ImportProvider;
  externalId: string | null;
  transactionDate: Date;
  description: string;
  amount: Money;
  reference: string | null;
  rawData: Record<string, string>;
}

export interface StatementPreviewResult {
  fileFormat: ImportFileFormat;
  transactionCount: number;
  transactions: StatementPreviewTransaction[];
  errors: ParsedRowError[];
}
