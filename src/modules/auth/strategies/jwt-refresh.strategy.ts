import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-access.strategy';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('jwt.refreshSecret'),
      passReqToCallback: true,
    });
  }

  validate(request: Request, payload: JwtPayload) {
    const refreshToken = ExtractJwt.fromAuthHeaderAsBearerToken()(
      request,
    ) as string;
    return { id: payload.sub, email: payload.email, refreshToken };
  }
}
