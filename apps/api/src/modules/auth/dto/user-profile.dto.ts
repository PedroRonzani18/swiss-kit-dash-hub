import { ApiProperty } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'pedroaugustogabironzani@gmail.com' })
  email: string;

  @ApiProperty({ nullable: true, example: 'Pedro Ronzani' })
  name: string | null;

  @ApiProperty({
    nullable: true,
    example: 'https://lh3.googleusercontent.com/a/profile-photo',
  })
  avatarUrl: string | null;

  @ApiProperty({ example: 'google' })
  provider: string;

  @ApiProperty({ nullable: true, example: '2026-04-03T12:30:00.000Z' })
  lastLoginAt: string | null;

  @ApiProperty({ example: '2026-04-01T10:15:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2026-04-03T12:30:00.000Z' })
  updatedAt: string;
}
