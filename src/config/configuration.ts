import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
}));

export const databaseConfig = registerAs('database', () => ({
  url: process.env.DATABASE_URL,
}));

export const jwtConfig = registerAs('jwt', () => ({
  accessSecret: process.env.JWT_ACCESS_SECRET,
  accessExpiration: process.env.JWT_ACCESS_EXPIRATION,
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  refreshExpiration: process.env.JWT_REFRESH_EXPIRATION,
}));
