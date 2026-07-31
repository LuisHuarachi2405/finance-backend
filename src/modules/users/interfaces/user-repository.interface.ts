import { User } from '../../../generated/prisma/client.js';

export interface CreateUserInput {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface UpdateUserProfileInput {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  preferredCurrency?: string;
  timezone?: string;
  language?: string;
}

export interface UserRepository {
  create(data: CreateUserInput): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  update(id: string, data: UpdateUserProfileInput): Promise<User>;
  updateRefreshToken(id: string, refreshToken: string | null): Promise<void>;
}
