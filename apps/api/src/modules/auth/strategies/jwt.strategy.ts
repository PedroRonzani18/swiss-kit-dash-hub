import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import type {
  AuthenticatedUserContract,
  JwtPayloadContract,
} from '@/common/contracts';
import { AuthRepository } from '../repositories/auth.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly authRepository: AuthRepository,
  ) {
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

  async validate(
    payload: JwtPayloadContract,
  ): Promise<AuthenticatedUserContract> {
    const user = await this.authRepository.findActiveAuthenticatedUser(
      payload.sub,
    );

    if (!user || (payload.sessionVersion ?? 0) !== user.sessionVersion) {
      throw new UnauthorizedException('Authenticated user is no longer active');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      provider: user.provider,
    };
  }
}
