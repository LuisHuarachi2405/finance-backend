import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import type { User } from '../../../generated/prisma/client.js';
import { UsersService } from '../../users/services/users.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { AuthService } from './auth.service';

jest.mock('bcrypt');

const mockUser: User = {
  id: 'user-id-1',
  username: 'johndoe',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phoneNumber: '+50370000000',
  password: 'hashed-password',
  refreshToken: null,
  preferredCurrency: 'PEN',
  timezone: 'UTC',
  language: 'es',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            findByUsername: jest.fn(),
            createUser: jest.fn(),
            findById: jest.fn(),
            updateRefreshToken: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn((key: string) => `mock-${key}`),
          },
        },
      ],
    }).compile();

    authService = module.get(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);

    jest.clearAllMocks();
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    jwtService.signAsync.mockResolvedValue('signed-token');
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      username: 'johndoe',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'StrongP@ssw0rd',
      phoneNumber: '+50370000000',
    };

    it('creates a user and returns the profile with a token pair', async () => {
      usersService.findByEmail.mockResolvedValue(null);
      usersService.findByUsername.mockResolvedValue(null);
      usersService.createUser.mockResolvedValue(mockUser);

      const result = await authService.register(registerDto);

      // eslint-disable-next-line @typescript-eslint/unbound-method -- known false positive for jest mock methods passed to expect()
      expect(usersService.createUser).toHaveBeenCalledWith({
        username: registerDto.username,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        email: registerDto.email,
        phoneNumber: registerDto.phoneNumber,
        password: 'hashed-password',
      });
      expect(result.user.email).toBe(mockUser.email);
      expect(result.tokens).toEqual({
        accessToken: 'signed-token',
        refreshToken: 'signed-token',
      });
    });

    it('throws ConflictException when the email is already in use', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);
      usersService.findByUsername.mockResolvedValue(null);

      await expect(authService.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('throws ConflictException when the username is already in use', async () => {
      usersService.findByEmail.mockResolvedValue(null);
      usersService.findByUsername.mockResolvedValue(mockUser);

      await expect(authService.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'john@example.com',
      password: 'StrongP@ssw0rd',
    };

    it('returns a token pair when credentials are valid', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);

      const result = await authService.login(loginDto);

      expect(result).toEqual({
        accessToken: 'signed-token',
        refreshToken: 'signed-token',
      });
    });

    it('throws UnauthorizedException when the user does not exist', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('throws UnauthorizedException when the password does not match', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
