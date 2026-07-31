import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { StringValue } from 'ms';
import { toUserEntity } from '../../users/mappers/user.mapper';
import { UsersService } from '../../users/services/users.service';
import { BCRYPT_SALT_ROUNDS } from '../constants/auth.constants';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { TokensDto } from '../dto/tokens.dto';
import { JwtPayload } from '../strategies/jwt-access.strategy';

const INVALID_CREDENTIALS_MESSAGE = 'Invalid credentials';
const ACCESS_DENIED_MESSAGE = 'Access denied';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const [existingByEmail, existingByUsername] = await Promise.all([
      this.usersService.findByEmail(dto.email),
      this.usersService.findByUsername(dto.username),
    ]);

    if (existingByEmail) {
      throw new ConflictException('Email already in use');
    }

    if (existingByUsername) {
      throw new ConflictException('Username already in use');
    }

    const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS);

    const user = await this.usersService.createUser({
      username: dto.username,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      password: hashedPassword,
    });

    const tokens = await this.issueTokenPair(user.id, user.email);

    return { user: toUserEntity(user), tokens };
  }

  async login(dto: LoginDto): Promise<TokensDto> {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    return this.issueTokenPair(user.id, user.email);
  }

  async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<TokensDto> {
    const user = await this.usersService.findById(userId);

    if (!user?.refreshToken) {
      throw new UnauthorizedException(ACCESS_DENIED_MESSAGE);
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException(ACCESS_DENIED_MESSAGE);
    }

    return this.issueTokenPair(user.id, user.email);
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.updateRefreshToken(userId, null);
  }

  private async issueTokenPair(
    userId: string,
    email: string,
  ): Promise<TokensDto> {
    const payload: JwtPayload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('jwt.accessSecret'),
        expiresIn: this.configService.getOrThrow<string>(
          'jwt.accessExpiration',
        ) as StringValue,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('jwt.refreshSecret'),
        expiresIn: this.configService.getOrThrow<string>(
          'jwt.refreshExpiration',
        ) as StringValue,
      }),
    ]);

    const hashedRefreshToken = await bcrypt.hash(
      refreshToken,
      BCRYPT_SALT_ROUNDS,
    );
    await this.usersService.updateRefreshToken(userId, hashedRefreshToken);

    return { accessToken, refreshToken };
  }
}
