import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { extname } from 'path';
import { AccountsService } from '../../accounts/services/accounts.service';
import {
  ImportFileFormat,
  ImportReconciliationStatus,
  ImportStatus,
  Statement,
} from '../../../generated/prisma/client.js';
import {
  MAX_FILE_SIZE_BYTES,
  STATEMENT_REPOSITORY,
} from '../constants/statement-imports.constants';
import { ListStatementsQueryDto } from '../dto/list-statements-query.dto';
import { UploadStatementDto } from '../dto/upload-statement.dto';
import {
  ImportedTransactionEntity,
  StatementEntity,
  StatementPreviewResult,
} from '../entities/statement.entity';
import type { ColumnMapping } from '../interfaces/statement-parser.interface';
import type {
  ImportedTransactionWithStatement,
  StatementRepository,
} from '../interfaces/statement-repository.interface';
import {
  toImportedTransactionEntity,
  toPreviewTransaction,
  toStatementEntity,
} from '../mappers/statement.mapper';
import { StatementParserRegistry } from '../parsers/statement-parser.registry';

@Injectable()
export class StatementImportsService {
  constructor(
    @Inject(STATEMENT_REPOSITORY)
    private readonly statementRepository: StatementRepository,
    private readonly accountsService: AccountsService,
    private readonly parserRegistry: StatementParserRegistry,
  ) {}

  async previewStatement(
    userId: string,
    dto: UploadStatementDto,
    file: Express.Multer.File | undefined,
  ): Promise<StatementPreviewResult> {
    this.validateFile(file);
    const account = await this.accountsService.getAccount(
      userId,
      dto.accountId,
    );
    const fileFormat = this.detectFileFormat(file.originalname);
    const parser = this.parserRegistry.getParser(dto.provider);
    const result = parser.parse(
      file.buffer,
      fileFormat,
      this.buildColumnMapping(dto),
      account.currency,
      dto.provider,
    );

    return {
      fileFormat,
      transactionCount: result.transactions.length,
      transactions: result.transactions.map(toPreviewTransaction),
      errors: result.errors,
    };
  }

  async importStatement(
    userId: string,
    dto: UploadStatementDto,
    file: Express.Multer.File | undefined,
  ): Promise<StatementEntity> {
    this.validateFile(file);
    const account = await this.accountsService.getAccount(
      userId,
      dto.accountId,
    );
    const fileFormat = this.detectFileFormat(file.originalname);
    const fileHash = createHash('sha256').update(file.buffer).digest('hex');

    const existing = await this.statementRepository.findByFileHash(
      userId,
      dto.accountId,
      fileHash,
    );

    if (existing) {
      throw new ConflictException(
        'This file has already been imported for this account',
      );
    }

    const parser = this.parserRegistry.getParser(dto.provider);
    const result = parser.parse(
      file.buffer,
      fileFormat,
      this.buildColumnMapping(dto),
      account.currency,
      dto.provider,
    );

    if (result.errors.length > 0) {
      throw new BadRequestException({
        message: 'The file contains invalid rows and was not imported',
        errors: result.errors,
      });
    }

    if (result.transactions.length === 0) {
      throw new BadRequestException('No transactions were found in the file');
    }

    const statement = await this.statementRepository.create({
      userId,
      accountId: dto.accountId,
      provider: dto.provider,
      fileFormat,
      fileName: file.originalname,
      fileHash,
      status: ImportStatus.PROCESSED,
      transactionCount: result.transactions.length,
      errorMessage: null,
      importedTransactions: result.transactions.map((transaction) => ({
        externalId: transaction.externalId,
        transactionDate: transaction.transactionDate,
        description: transaction.description,
        amount: transaction.amount,
        currency: transaction.currency,
        reference: transaction.reference,
        rawData: transaction.rawData,
      })),
    });

    return toStatementEntity(statement);
  }

  async getStatement(userId: string, id: string): Promise<StatementEntity> {
    const statement = await this.findOwnedStatement(userId, id);
    return toStatementEntity(statement);
  }

  async listStatements(
    userId: string,
    query: ListStatementsQueryDto,
  ): Promise<StatementEntity[]> {
    const statements = await this.statementRepository.findAllByUser(userId, {
      accountId: query.accountId,
      provider: query.provider,
      status: query.status,
    });

    return statements.map(toStatementEntity);
  }

  async getImportedTransactions(
    userId: string,
    statementId: string,
  ): Promise<ImportedTransactionEntity[]> {
    await this.findOwnedStatement(userId, statementId);
    const transactions =
      await this.statementRepository.findTransactionsByStatementId(statementId);

    return transactions.map(toImportedTransactionEntity);
  }

  async getImportedTransactionWithStatement(
    userId: string,
    id: string,
  ): Promise<ImportedTransactionWithStatement> {
    const result =
      await this.statementRepository.findImportedTransactionWithStatement(id);

    if (!result || result.statement.userId !== userId) {
      throw new NotFoundException('Imported transaction not found');
    }

    return result;
  }

  listUnreconciledImportedTransactions(
    userId: string,
    accountId?: string,
  ): Promise<ImportedTransactionWithStatement[]> {
    return this.statementRepository.findUnreconciledImportedTransactions(
      userId,
      accountId,
    );
  }

  async setReconciliationStatus(
    userId: string,
    importedTransactionId: string,
    status: ImportReconciliationStatus,
  ): Promise<void> {
    await this.getImportedTransactionWithStatement(
      userId,
      importedTransactionId,
    );
    await this.statementRepository.updateImportedTransactionReconciliationStatus(
      importedTransactionId,
      status,
    );
  }

  private async findOwnedStatement(
    userId: string,
    id: string,
  ): Promise<Statement> {
    const statement = await this.statementRepository.findById(id);

    if (!statement || statement.userId !== userId) {
      throw new NotFoundException('Statement not found');
    }

    return statement;
  }

  private validateFile(
    file: Express.Multer.File | undefined,
  ): asserts file is Express.Multer.File {
    if (!file) {
      throw new BadRequestException('A file is required');
    }

    if (file.size === 0) {
      throw new BadRequestException('The file must not be empty');
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new BadRequestException(
        'The file exceeds the maximum allowed size',
      );
    }
  }

  private detectFileFormat(fileName: string): ImportFileFormat {
    const extension = extname(fileName).toLowerCase();

    if (extension === '.csv') {
      return ImportFileFormat.CSV;
    }

    if (extension === '.xlsx') {
      return ImportFileFormat.XLSX;
    }

    throw new BadRequestException(`Unsupported file extension: ${extension}`);
  }

  private buildColumnMapping(dto: UploadStatementDto): ColumnMapping {
    return {
      dateColumn: dto.dateColumn,
      descriptionColumn: dto.descriptionColumn,
      amountColumn: dto.amountColumn,
      currencyColumn: dto.currencyColumn,
      externalIdColumn: dto.externalIdColumn,
      referenceColumn: dto.referenceColumn,
      dateFormat: dto.dateFormat,
    };
  }
}
