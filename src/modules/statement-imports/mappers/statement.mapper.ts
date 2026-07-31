import {
  ImportedTransaction,
  Statement,
} from '../../../generated/prisma/client.js';
import { Money } from '../../../common/value-objects/money.value-object';
import {
  ImportedTransactionEntity,
  StatementEntity,
  StatementPreviewTransaction,
} from '../entities/statement.entity';
import { ParsedImportedTransaction } from '../interfaces/statement-parser.interface';

export function toStatementEntity(statement: Statement): StatementEntity {
  return {
    id: statement.id,
    userId: statement.userId,
    accountId: statement.accountId,
    provider: statement.provider,
    fileFormat: statement.fileFormat,
    fileName: statement.fileName,
    status: statement.status,
    transactionCount: statement.transactionCount,
    errorMessage: statement.errorMessage,
    importedAt: statement.importedAt,
  };
}

export function toImportedTransactionEntity(
  importedTransaction: ImportedTransaction,
): ImportedTransactionEntity {
  return {
    id: importedTransaction.id,
    statementId: importedTransaction.statementId,
    externalId: importedTransaction.externalId,
    transactionDate: importedTransaction.transactionDate,
    description: importedTransaction.description,
    amount: new Money(
      importedTransaction.amount.toNumber(),
      importedTransaction.currency,
    ),
    reference: importedTransaction.reference,
    rawData: importedTransaction.rawData as Record<string, string>,
    reconciliationStatus: importedTransaction.reconciliationStatus,
    createdAt: importedTransaction.createdAt,
  };
}

export function toPreviewTransaction(
  parsed: ParsedImportedTransaction,
): StatementPreviewTransaction {
  return {
    provider: parsed.provider,
    externalId: parsed.externalId,
    transactionDate: parsed.transactionDate,
    description: parsed.description,
    amount: new Money(parsed.amount, parsed.currency),
    reference: parsed.reference,
    rawData: parsed.rawData,
  };
}
