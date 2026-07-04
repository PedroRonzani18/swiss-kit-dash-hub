import { ApiProperty } from '@nestjs/swagger';
import type { AuthProvider } from '@swisskit/contracts/core';

export class CoreSessionUserDto {
  @ApiProperty({ example: 'user-id' })
  id!: string;

  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({ example: 'User Name', nullable: true })
  name!: string | null;

  @ApiProperty({ example: 'google' })
  provider!: AuthProvider;
}

export class CoreSessionCheckResponseDto {
  @ApiProperty({ example: 'authenticated' })
  status!: 'authenticated';

  @ApiProperty({ type: () => CoreSessionUserDto })
  user!: CoreSessionUserDto;
}
