import { ApiProperty } from '@nestjs/swagger';
import type { UserProfileContract } from '@swisskit/contracts/users';
import type { AuthProvider } from '@swisskit/contracts/core';
import type {
  CreateUserInputContract,
  UpdateUserStatusInputContract,
} from '@swisskit/contracts/users';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class UserProfileDto implements UserProfileContract {
  @ApiProperty({ example: 'user-id' })
  id!: string;

  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({ example: 'User Name', nullable: true })
  name!: string | null;

  @ApiProperty({ example: 'https://example.com/avatar.png', nullable: true })
  avatarUrl!: string | null;

  @ApiProperty({ example: true })
  isActive!: boolean;

  @ApiProperty({ example: 'Temporary collaborator', nullable: true })
  note!: string | null;

  @ApiProperty({ example: 'google', nullable: true })
  provider!: AuthProvider | null;

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

export class CreateUserDto implements CreateUserInputContract {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'Temporary collaborator',
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsString()
  note?: string | null;
}

export class UpdateUserStatusDto implements UpdateUserStatusInputContract {
  @ApiProperty({ example: true })
  @IsBoolean()
  isActive!: boolean;
}
