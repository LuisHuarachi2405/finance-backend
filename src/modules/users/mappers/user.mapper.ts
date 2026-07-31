import { User } from '../../../generated/prisma/client.js';
import { UserEntity } from '../entities/user.entity';

export function toUserEntity(user: User): UserEntity {
  return {
    id: user.id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    preferredCurrency: user.preferredCurrency,
    timezone: user.timezone,
    language: user.language,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
