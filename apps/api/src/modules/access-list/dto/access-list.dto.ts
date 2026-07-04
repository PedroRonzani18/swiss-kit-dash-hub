import { ApiProperty } from '@nestjs/swagger';
import type {
  AllowedEmailContract,
  AllowedEmailsOverviewContract,
  CreateAllowedEmailInputContract,
  UpdateAllowedEmailStatusInputContract,
} from '@swisskit/contracts/allowed-emails';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class AccessListEntryDto implements AllowedEmailContract {
  @ApiProperty({ example: 'entry-id' })
  id!: string;

  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({ example: true })
  isActive!: boolean;

  @ApiProperty({ example: 'Seed record', nullable: true })
  note!: string | null;

  @ApiProperty({ example: '2026-07-04T21:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-07-04T21:00:00.000Z' })
  updatedAt!: string;
}

export class AccessListOverviewDto implements AllowedEmailsOverviewContract {
  @ApiProperty({ example: 'allowed-emails' })
  module!: 'allowed-emails';

  @ApiProperty({ example: 'available' })
  status!: 'available';

  @ApiProperty({ type: () => [AccessListEntryDto] })
  allowedEmails!: AccessListEntryDto[];
}

export class CreateAccessListEntryDto implements CreateAllowedEmailInputContract {
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

export class UpdateAccessListEntryStatusDto implements UpdateAllowedEmailStatusInputContract {
  @ApiProperty({ example: true })
  @IsBoolean()
  isActive!: boolean;
}
