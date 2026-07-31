import {
  ImportedTransaction,
  ImportFileFormat,
  ImportProvider,
  ImportReconciliationStatus,
  ImportStatus,
  Statement,
} from '../../../generated/prisma/client.js';

export interface ImportedTransactionWithStatement extends ImportedTransaction {
  statement: Statement;
}

export interface CreateImportedTransactionInput {
  externalId?: string | null;
  transactionDate: Date;
  description: string;
  amount: number;
  currency: string;
  reference?: string | null;
  rawData: Record<string, string>;
}

export interface CreateStatementInput {
  userId: string;
  accountId: string;
  provider: ImportProvider;
  fileFormat: ImportFileFormat;
  fileName: string;
  fileHash: string;
  status: ImportStatus;
  transactionCount: number;
  errorMessage?: string | null;
  importedTransactions: CreateImportedTransactionInput[];
}

export interface ListStatementsFilter {
  accountId?: string;
  provider?: ImportProvider;
  status?: ImportStatus;
}

export interface StatementRepository {
  create(data: CreateStatementInput): Promise<Statement>;
  findById(id: string): Promise<Statement | null>;
  findByFileHash(
    userId: string,
    accountId: string,
    fileHash: string,
  ): Promise<Statement | null>;
  findAllByUser(
    userId: string,
    filter: ListStatementsFilter,
  ): Promise<Statement[]>;
  findTransactionsByStatementId(
    statementId: string,
  ): Promise<ImportedTransaction[]>;
  findImportedTransactionWithStatement(
    id: string,
  ): Promise<ImportedTransactionWithStatement | null>;
  findUnreconciledImportedTransactions(
    userId: string,
    accountId?: string,
  ): Promise<ImportedTransactionWithStatement[]>;
  updateImportedTransactionReconciliationStatus(
    id: string,
    status: ImportReconciliationStatus,
  ): Promise<void>;
}
