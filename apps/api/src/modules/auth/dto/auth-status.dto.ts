import { ApiProperty } from '@nestjs/swagger';

export class AuthStatusDto {
  @ApiProperty({ example: true })
  success: boolean;
}
