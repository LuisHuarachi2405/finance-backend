import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { User } from '../../../generated/prisma/client.js';
import {
  CreateUserInput,
  UpdateUserProfileInput,
  UserRepository,
} from '../interfaces/user-repository.interface';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateUserInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { username } });
  }

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  update(id: string, data: UpdateUserProfileInput): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async updateRefreshToken(
    id: string,
    refreshToken: string | null,
  ): Promise<void> {
    await this.prisma.user.update({ where: { id }, data: { refreshToken } });
  }
}
