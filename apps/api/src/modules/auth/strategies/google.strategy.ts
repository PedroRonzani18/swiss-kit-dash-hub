import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, type Profile } from 'passport-google-oauth20';
import type { GoogleAuthProfileContract } from '@/common/contracts';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ): GoogleAuthProfileContract {
    const email = profile.emails?.[0]?.value?.toLowerCase().trim();

    if (!email) {
      throw new UnauthorizedException('Google account does not provide an email');
    }

    return {
      email,
      name: profile.displayName?.trim() || null,
      avatarUrl: profile.photos?.[0]?.value || null,
      providerUserId: profile.id,
    };
  }
}
