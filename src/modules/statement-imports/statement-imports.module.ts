import { Module } from '@nestjs/common';
import { AccountsModule } from '../accounts/accounts.module';
import { StatementImportsController } from './controllers/statement-imports.controller';
import { STATEMENT_REPOSITORY } from './constants/statement-imports.constants';
import { GenericColumnMappingParser } from './parsers/generic-column-mapping.parser';
import { StatementParserRegistry } from './parsers/statement-parser.registry';
import { PrismaStatementRepository } from './repositories/statement.repository';
import { StatementImportsService } from './services/statement-imports.service';

@Module({
  imports: [AccountsModule],
  controllers: [StatementImportsController],
  providers: [
    StatementImportsService,
    GenericColumnMappingParser,
    StatementParserRegistry,
    { provide: STATEMENT_REPOSITORY, useClass: PrismaStatementRepository },
  ],
  exports: [StatementImportsService],
})
export class StatementImportsModule {}
