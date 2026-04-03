import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import type { AuthenticatedUserContract } from '@/common/contracts';
import { CurrentUser, Public, type GoogleAuthRequest } from '@/common/auth';
import { AuthService } from './auth.service';
import { AuthSessionDto } from './dto/auth-session.dto';
import { UserProfileDto } from './dto/user-profile.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Start Google OAuth login flow' })
  @ApiUnauthorizedResponse({ description: 'Google authentication failed' })
  googleAuth(): void {
    // Handled by Passport Google strategy redirect.
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth callback and JWT issuance' })
  @ApiOkResponse({ type: AuthSessionDto })
  googleCallback(@Req() request: GoogleAuthRequest) {
    return this.authService.loginWithGoogle(request.user);
  }

  @Get('me')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get authenticated user profile' })
  @ApiOkResponse({ type: UserProfileDto })
  me(@CurrentUser() user: AuthenticatedUserContract) {
    return this.authService.getMe(user.id);
  }
}
