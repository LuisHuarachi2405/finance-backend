import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig, databaseConfig, jwtConfig } from './config/configuration';
import { validate } from './config/env.validation';
import { AccountsModule } from './modules/accounts/accounts.module';
import { AuthModule } from './modules/auth/auth.module';
import { BudgetsModule } from './modules/budgets/budgets.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { FinancialHealthModule } from './modules/financial-health/financial-health.module';
import { ReconciliationModule } from './modules/reconciliation/reconciliation.module';
import { ReportsModule } from './modules/reports/reports.module';
import { StatementImportsModule } from './modules/statement-imports/statement-imports.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      load: [appConfig, databaseConfig, jwtConfig],
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    AccountsModule,
    CategoriesModule,
    TransactionsModule,
    BudgetsModule,
    ReportsModule,
    StatementImportsModule,
    ReconciliationModule,
    FinancialHealthModule,
  ],
})
export class AppModule {}
