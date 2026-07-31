import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { USER_REPOSITORY } from './constants/users.constants';
import { PrismaUserRepository } from './repositories/user.repository';
import { UsersService } from './services/users.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    { provide: USER_REPOSITORY, useClass: PrismaUserRepository },
  ],
  exports: [UsersService],
})
export class UsersModule {}
