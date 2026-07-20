import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ nullable: true, example: 'Example User' })
  name: string | null;

  @ApiProperty({ example: 'google' })
  provider: string;
}
