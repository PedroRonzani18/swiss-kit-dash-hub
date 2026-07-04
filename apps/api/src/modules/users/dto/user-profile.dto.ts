import { ApiProperty } from '@nestjs/swagger';
import type { UserProfileContract } from '@swisskit/contracts/users';
import type { AuthProvider } from '@swisskit/contracts/core';

export class UserProfileDto implements UserProfileContract {
  @ApiProperty({ example: 'user-id' })
  id!: string;

  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({ example: 'User Name', nullable: true })
  name!: string | null;

  @ApiProperty({ example: 'https://example.com/avatar.png', nullable: true })
  avatarUrl!: string | null;

  @ApiProperty({ example: 'google' })
  provider!: AuthProvider;

  @ApiProperty({ example: '2026-07-04T21:00:00.000Z', nullable: true })
  lastLoginAt!: string | null;

  @ApiProperty({ example: '2026-07-04T21:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-07-04T21:00:00.000Z' })
  updatedAt!: string;
}

export class UsersOverviewDto {
  @ApiProperty({ example: 'users' })
  module!: 'users';

  @ApiProperty({ example: 'available' })
  status!: 'available';

  @ApiProperty({ type: () => [UserProfileDto] })
  users!: UserProfileDto[];
}
