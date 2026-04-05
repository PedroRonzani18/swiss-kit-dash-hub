import {
  Controller,
  Get,
  HttpException,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
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
import { AuthSessionDto } from './dto/auth-session.dto';
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
        if (window.opener) {
          window.opener.postMessage(message, "*");
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
  @ApiOperation({ summary: 'Google OAuth callback and JWT issuance' })
  @ApiOkResponse({ type: AuthSessionDto })
  async googleCallback(
    @Req() request: GoogleAuthRequest,
    @Res() response: Response,
  ) {
    const acceptsHtml = request.headers.accept?.includes('text/html') ?? false;

    try {
      const session = await this.authService.loginWithGoogle(request.user);

      if (acceptsHtml) {
        return response
          .status(200)
          .type('text/html')
          .send(this.renderOAuthHtmlMessage('swisskit:auth:success', session));
      }

      return response.status(200).json(session);
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

  @Get('me')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get authenticated user profile' })
  @ApiOkResponse({ type: UserProfileDto })
  me(@CurrentUser() user: AuthenticatedUserContract) {
    return this.authService.getMe(user.id);
  }
}
