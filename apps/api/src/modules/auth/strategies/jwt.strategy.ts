import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import type {
  AuthenticatedUserContract,
  JwtPayloadContract,
} from '@/common/contracts';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    const authCookieName =
      configService.get<string>('AUTH_COOKIE_NAME') || 'swisskit_auth';

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request): string | null => {
          const token = request?.cookies?.[authCookieName];
          return typeof token === 'string' && token.length > 0 ? token : null;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  validate(payload: JwtPayloadContract): AuthenticatedUserContract {
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      provider: payload.provider,
    };
  }
}
