import {
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import type { AuthenticatedUserContract } from '@/common/contracts';
import { CurrentUser, Public, type GoogleAuthRequest } from '@/common/auth';
import { AuthService } from './auth.service';
import { AuthCallbackDto } from './dto/auth-callback.dto';
import { AuthStatusDto } from './dto/auth-status.dto';
import { UserProfileDto } from './dto/user-profile.dto';
import {
  buildOAuthErrorCallbackResponse,
  buildOAuthSuccessCallbackResponse,
  type OAuthCallbackResponseBody,
  shouldRenderOAuthHtml,
} from './utils/oauth-callback.util';

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
  @ApiOperation({
    summary: 'Google OAuth callback and authentication cookie issuance',
  })
  @ApiOkResponse({ type: AuthCallbackDto })
  async googleCallback(
    @Req() request: GoogleAuthRequest,
    @Res() response: Response,
  ) {
    const prefersHtmlCallback = shouldRenderOAuthHtml(request.headers.accept);
    const callbackContext = {
      targetOrigin: this.authService.getWebAppOrigin(),
      fallbackRedirectUrl: this.authService.getWebAppUrl(),
    };

    try {
      const authResult = await this.authService.loginWithGoogle(request.user);
      response.cookie(
        this.authService.getAuthCookieName(),
        authResult.accessToken,
        this.authService.getAuthCookieOptions(),
      );

      const successResponse = buildOAuthSuccessCallbackResponse({
        user: authResult.user,
        prefersHtml: prefersHtmlCallback,
        ...callbackContext,
      });

      return this.sendOAuthCallbackResponse(response, successResponse);
    } catch (error) {
      if (!prefersHtmlCallback) {
        throw error;
      }

      const errorResponse = buildOAuthErrorCallbackResponse({
        error,
        ...callbackContext,
      });

      return this.sendOAuthCallbackResponse(response, errorResponse);
    }
  }

  @Public()
  @Post('logout')
  @HttpCode(200)
  @ApiOperation({ summary: 'Clear authentication cookie' })
  @ApiOkResponse({ type: AuthStatusDto })
  logout(@Res() response: Response) {
    response.clearCookie(
      this.authService.getAuthCookieName(),
      this.authService.getAuthCookieClearOptions(),
    );

    return response.status(200).json({ success: true });
  }

  @Get('me')
  @ApiCookieAuth('cookie')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get authenticated user profile' })
  @ApiOkResponse({ type: UserProfileDto })
  me(@CurrentUser() user: AuthenticatedUserContract) {
    return this.authService.getMe(user.id);
  }

  private sendOAuthCallbackResponse(
    response: Response,
    callbackResponse: OAuthCallbackResponseBody,
  ) {
    if (callbackResponse.kind === 'json') {
      return response
        .status(callbackResponse.statusCode)
        .json(callbackResponse.body);
    }

    return response
      .status(callbackResponse.statusCode)
      .type('text/html')
      .send(callbackResponse.body);
  }
}
