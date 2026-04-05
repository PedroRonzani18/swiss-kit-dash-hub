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

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    configService: ConfigService,
  ) {
    this.jwtExpiresIn = configService.get<string>('JWT_EXPIRES_IN') || '1d';
  }

  async loginWithGoogle(profile: GoogleAuthProfileContract): Promise<AuthSessionContract> {
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
}
