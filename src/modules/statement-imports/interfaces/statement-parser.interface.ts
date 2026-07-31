import {
  ImportFileFormat,
  ImportProvider,
} from '../../../generated/prisma/client.js';

export interface ColumnMapping {
  dateColumn: string;
  descriptionColumn: string;
  amountColumn: string;
  currencyColumn?: string;
  externalIdColumn?: string;
  referenceColumn?: string;
  dateFormat?: string;
}

export interface ParsedImportedTransaction {
  provider: ImportProvider;
  externalId: string | null;
  transactionDate: Date;
  description: string;
  amount: number;
  currency: string;
  reference: string | null;
  rawData: Record<string, string>;
}

export interface ParsedRowError {
  rowNumber: number;
  message: string;
}

export interface ParseStatementResult {
  transactions: ParsedImportedTransaction[];
  errors: ParsedRowError[];
}

export interface StatementParser {
  parse(
    buffer: Buffer,
    fileFormat: ImportFileFormat,
    columnMapping: ColumnMapping,
    defaultCurrency: string,
    provider: ImportProvider,
  ): ParseStatementResult;
}
