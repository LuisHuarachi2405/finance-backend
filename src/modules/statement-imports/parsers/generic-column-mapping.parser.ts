import { Injectable } from '@nestjs/common';
import {
  ImportFileFormat,
  ImportProvider,
} from '../../../generated/prisma/client.js';
import {
  ColumnMapping,
  ParsedImportedTransaction,
  ParsedRowError,
  ParseStatementResult,
  StatementParser,
} from '../interfaces/statement-parser.interface';
import { parseDateValue } from './date-value.parser';
import { readFileAsRows } from './file-table-reader';

@Injectable()
export class GenericColumnMappingParser implements StatementParser {
  parse(
    buffer: Buffer,
    fileFormat: ImportFileFormat,
    columnMapping: ColumnMapping,
    defaultCurrency: string,
    provider: ImportProvider,
  ): ParseStatementResult {
    const rows = readFileAsRows(buffer, fileFormat);
    const transactions: ParsedImportedTransaction[] = [];
    const errors: ParsedRowError[] = [];

    rows.forEach((row, index) => {
      try {
        transactions.push(
          this.parseRow(row, columnMapping, defaultCurrency, provider),
        );
      } catch (error) {
        errors.push({
          rowNumber: index + 1,
          message:
            error instanceof Error ? error.message : 'Unknown parsing error',
        });
      }
    });

    return { transactions, errors };
  }

  private parseRow(
    row: Record<string, string>,
    mapping: ColumnMapping,
    defaultCurrency: string,
    provider: ImportProvider,
  ): ParsedImportedTransaction {
    const dateValue = row[mapping.dateColumn];
    const descriptionValue = row[mapping.descriptionColumn];
    const amountValue = row[mapping.amountColumn];

    if (!dateValue) {
      throw new Error(`Missing value for date column "${mapping.dateColumn}"`);
    }

    if (!descriptionValue) {
      throw new Error(
        `Missing value for description column "${mapping.descriptionColumn}"`,
      );
    }

    if (!amountValue) {
      throw new Error(
        `Missing value for amount column "${mapping.amountColumn}"`,
      );
    }

    const amount = this.parseNumber(amountValue);

    if (amount === null) {
      throw new Error(`Value "${amountValue}" is not a valid amount`);
    }

    return {
      provider,
      externalId: this.readOptionalColumn(row, mapping.externalIdColumn),
      transactionDate: parseDateValue(dateValue, mapping.dateFormat),
      description: descriptionValue,
      amount,
      currency:
        this.readOptionalColumn(row, mapping.currencyColumn) ?? defaultCurrency,
      reference: this.readOptionalColumn(row, mapping.referenceColumn),
      rawData: row,
    };
  }

  private readOptionalColumn(
    row: Record<string, string>,
    column?: string,
  ): string | null {
    if (!column) {
      return null;
    }

    return row[column] || null;
  }

  private parseNumber(value: string): number | null {
    const parsed = Number(value.replace(/,/g, ''));
    return Number.isNaN(parsed) ? null : parsed;
  }
}
