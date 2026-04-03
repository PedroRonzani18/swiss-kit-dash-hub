import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type {
  AuthSessionContract,
  GoogleAuthProfileContract,
  JwtPayloadContract,
  UserContract,
} from '@/common/contracts';
import { mapAuthenticatedUser } from '@/common/mappers';
import { AuthRepository } from './repositories/auth.repository';

@Injectable()
export class AuthService {
  private readonly jwtExpiresIn: string;
  private readonly allowedEmails: Set<string>;

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    configService: ConfigService,
  ) {
    this.jwtExpiresIn = configService.get<string>('JWT_EXPIRES_IN') || '1d';

    const allowedEmailsRaw =
      configService.get<string>('AUTH_ALLOWED_EMAILS') ||
      'pedroaugustogabironzani@gmail.com';

    this.allowedEmails = new Set(
      allowedEmailsRaw
        .split(',')
        .map(email => email.toLowerCase().trim())
        .filter(Boolean),
    );
  }

  async loginWithGoogle(profile: GoogleAuthProfileContract): Promise<AuthSessionContract> {
    this.assertAllowedEmail(profile.email);

    const normalizedProfile: GoogleAuthProfileContract = {
      ...profile,
      email: profile.email.toLowerCase().trim(),
    };

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

  async getMe(userId: string): Promise<UserContract> {
    const user = await this.authRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Authenticated user not found');
    }

    return user;
  }

  private assertAllowedEmail(email: string): void {
    const normalizedEmail = email.toLowerCase().trim();
    if (!this.allowedEmails.has(normalizedEmail)) {
      throw new ForbiddenException('Your Google account is not allowed to access this API');
    }
  }
}
