import { ApiProperty } from '@nestjs/swagger';
import { AuthUserDto } from './auth-user.dto';

export class AuthCallbackDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: AuthUserDto })
  user: AuthUserDto;
}
