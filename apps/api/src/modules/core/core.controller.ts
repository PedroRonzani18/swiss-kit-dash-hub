import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser, RequirePermissions } from '@/common/auth';
import type { AuthenticatedUserContract } from '@/common/contracts';

@ApiTags('Core')
@Controller('core')
export class CoreController {
  @Get('session-check')
  @RequirePermissions('core:access')
  @ApiCookieAuth('cookie')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Verify authenticated core session' })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'authenticated' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'user-id' },
            email: { type: 'string', example: 'user@example.com' },
            name: { type: 'string', nullable: true, example: 'User Name' },
            provider: { type: 'string', example: 'google' },
          },
          required: ['id', 'email', 'name', 'provider'],
        },
      },
      required: ['status', 'user'],
    },
  })
  sessionCheck(@CurrentUser() user: AuthenticatedUserContract) {
    return {
      status: 'authenticated' as const,
      user,
    };
  }
}
