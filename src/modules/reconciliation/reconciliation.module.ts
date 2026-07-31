import { Module } from '@nestjs/common';
import { StatementImportsModule } from '../statement-imports/statement-imports.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { ReconciliationController } from './controllers/reconciliation.controller';
import {
  MATCHING_STRATEGY,
  RECONCILIATION_REPOSITORY,
} from './constants/reconciliation.constants';
import { PrismaReconciliationRepository } from './repositories/reconciliation.repository';
import { ReconciliationService } from './services/reconciliation.service';
import { DefaultMatchingStrategy } from './strategies/default-matching.strategy';

@Module({
  imports: [StatementImportsModule, TransactionsModule],
  controllers: [ReconciliationController],
  providers: [
    ReconciliationService,
    {
      provide: RECONCILIATION_REPOSITORY,
      useClass: PrismaReconciliationRepository,
    },
    { provide: MATCHING_STRATEGY, useClass: DefaultMatchingStrategy },
  ],
  exports: [ReconciliationService],
})
export class ReconciliationModule {}
