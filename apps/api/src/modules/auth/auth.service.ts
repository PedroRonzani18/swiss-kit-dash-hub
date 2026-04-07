import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import ms, { type StringValue } from 'ms';
import type { CookieOptions } from 'express';
import type {
  AuthLoginResultContract,
  GoogleAuthProfileContract,
  JwtPayloadContract,
  UserContract,
} from '@/common/contracts';
import { mapAuthenticatedUser } from '@/common/mappers';
import { AuthRepository } from './repositories/auth.repository';

@Injectable()
export class AuthService {
  private readonly jwtExpiresIn: string;
  private readonly authCookieName: string;
  private readonly authCookieSameSite: CookieOptions['sameSite'];
  private readonly authCookieSecure: boolean;
  private readonly authCookieMaxAge: number | undefined;
  private readonly webAppUrl: string;
  private readonly webAppOrigin: string;
  private readonly isProduction: boolean;

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    configService: ConfigService,
  ) {
    this.jwtExpiresIn = configService.get<string>('JWT_EXPIRES_IN') || '1d';
    this.authCookieName =
      configService.get<string>('AUTH_COOKIE_NAME') || 'swisskit_auth';
    this.authCookieSameSite =
      (configService.get<string>('AUTH_COOKIE_SAME_SITE') as CookieOptions['sameSite']) ||
      'lax';
    const parsedWebAppUrl = new URL(
      configService.getOrThrow<string>('WEB_APP_URL'),
    );
    this.webAppUrl = parsedWebAppUrl.toString();
    this.webAppOrigin = parsedWebAppUrl.origin;
    this.isProduction = configService.get<string>('NODE_ENV') === 'production';
    this.authCookieSecure = this.isProduction || this.authCookieSameSite === 'none';

    if (this.authCookieSameSite === 'none' && !this.authCookieSecure) {
      throw new Error(
        'Invalid auth cookie configuration: AUTH_COOKIE_SAME_SITE=none requires secure=true',
      );
    }

    const parsedMaxAge = ms(this.jwtExpiresIn as StringValue);
    this.authCookieMaxAge =
      typeof parsedMaxAge === 'number' && parsedMaxAge > 0
        ? parsedMaxAge
        : undefined;
  }

  async loginWithGoogle(
    profile: GoogleAuthProfileContract,
  ): Promise<AuthLoginResultContract> {
    const normalizedProfile: GoogleAuthProfileContract = {
      ...profile,
      email: profile.email.toLowerCase().trim(),
    };
    await this.assertAllowedEmail(normalizedProfile.email);

    const user = await this.authRepository.upsertGoogleUser(normalizedProfile);
    const payload: JwtPayloadContract = {
      sub: user.id,
      email: user.email,
      name: user.name,
      provider: user.provider,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: this.jwtExpiresIn,
      user: mapAuthenticatedUser(user),
    };
  }

  getAuthCookieName(): string {
    return this.authCookieName;
  }

  getWebAppUrl(): string {
    return this.webAppUrl;
  }

  getWebAppOrigin(): string {
    return this.webAppOrigin;
  }

  getAuthCookieOptions(): CookieOptions {
    const baseOptions = this.getAuthCookieBaseOptions();

    if (!this.authCookieMaxAge) {
      return baseOptions;
    }

    return {
      ...baseOptions,
      maxAge: this.authCookieMaxAge,
    };
  }

  getAuthCookieClearOptions(): CookieOptions {
    return this.getAuthCookieBaseOptions();
  }

  async getMe(userId: string): Promise<UserContract> {
    const user = await this.authRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Authenticated user not found');
    }

    return user;
  }

  private async assertAllowedEmail(email: string): Promise<void> {
    const isAllowed = await this.authRepository.isAllowedEmail(email);

    if (!isAllowed) {
      throw new ForbiddenException('Your Google account is not allowed to access this API');
    }
  }

  private getAuthCookieBaseOptions(): CookieOptions {
    return {
      httpOnly: true,
      sameSite: this.authCookieSameSite,
      secure: this.authCookieSecure,
      path: '/',
    };
  }
}
