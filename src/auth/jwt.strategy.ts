import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWTToken } from './jwt.token';
import { ConfigService } from '@nestjs/config';
import { Privilege } from './privilege';

export const STRATEGY_NAME = 'jwt-with-privileges';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, STRATEGY_NAME) {
  constructor(configService: ConfigService) {
    const JWT_SECRET = configService.get<string>('JWT_SECRET');

    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET env variable must be set');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  validate(payload: JWTToken): { userId: string; privileges: Privilege[] } {
    if (!payload.privileges) {
      throw new Error('JWT payload does not contain privileges');
    }

    return {
      userId: payload.sub,
      privileges: payload.privileges,
    };
  }
}
