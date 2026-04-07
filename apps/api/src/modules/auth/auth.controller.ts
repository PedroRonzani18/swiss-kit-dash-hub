import {
  Controller,
  Get,
  HttpCode,
  HttpException,
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

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private renderOAuthHtmlMessage(
    type: 'swisskit:auth:success' | 'swisskit:auth:error',
    payload: unknown,
  ): string {
    const serializedPayload = JSON.stringify({ type, payload }).replace(
      /</g,
      '\\u003c',
    );
    const targetOrigin = JSON.stringify(this.authService.getWebAppUrl());

    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>SwissKit Auth</title>
  </head>
  <body>
    <script>
      (function () {
        var message = ${serializedPayload};
        var targetOrigin = ${targetOrigin};
        if (window.opener) {
          window.opener.postMessage(message, targetOrigin);
          window.close();
          return;
        }
        document.body.innerText = JSON.stringify(message.payload);
      })();
    </script>
  </body>
</html>`;
  }

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
  @ApiOperation({ summary: 'Google OAuth callback and authentication cookie issuance' })
  @ApiOkResponse({ type: AuthCallbackDto })
  async googleCallback(
    @Req() request: GoogleAuthRequest,
    @Res() response: Response,
  ) {
    const acceptsHtml = request.headers.accept?.includes('text/html') ?? false;

    try {
      const authResult = await this.authService.loginWithGoogle(request.user);
      response.cookie(
        this.authService.getAuthCookieName(),
        authResult.accessToken,
        this.authService.getAuthCookieOptions(),
      );

      const callbackPayload = {
        success: true,
        user: authResult.user,
      };

      if (acceptsHtml) {
        return response
          .status(200)
          .type('text/html')
          .send(
            this.renderOAuthHtmlMessage('swisskit:auth:success', callbackPayload),
          );
      }

      return response.status(200).json(callbackPayload);
    } catch (error) {
      if (!acceptsHtml) {
        throw error;
      }

      const statusCode =
        error instanceof HttpException ? error.getStatus() : 401;
      const message =
        error instanceof Error
          ? error.message
          : 'Authentication failed during Google callback';

      return response
        .status(statusCode)
        .type('text/html')
        .send(
          this.renderOAuthHtmlMessage('swisskit:auth:error', {
            message,
          }),
        );
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
}
