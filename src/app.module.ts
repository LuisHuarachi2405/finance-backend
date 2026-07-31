import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig, databaseConfig, jwtConfig } from './config/configuration';
import { validate } from './config/env.validation';
import { AccountsModule } from './modules/accounts/accounts.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
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
  ],
})
export class AppModule {}
