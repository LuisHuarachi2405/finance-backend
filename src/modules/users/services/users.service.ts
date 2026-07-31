import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../../../generated/prisma/client.js';
import { USER_REPOSITORY } from '../constants/users.constants';
import type {
  CreateUserInput,
  UpdateUserProfileInput,
  UserRepository,
} from '../interfaces/user-repository.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
  ) {}

  createUser(data: CreateUserInput): Promise<User> {
    return this.userRepository.create(data);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findByUsername(username);
  }

  findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async getProfile(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(id: string, data: UpdateUserProfileInput): Promise<User> {
    await this.getProfile(id);
    return this.userRepository.update(id, data);
  }

  updateRefreshToken(id: string, refreshToken: string | null): Promise<void> {
    return this.userRepository.updateRefreshToken(id, refreshToken);
  }
}
