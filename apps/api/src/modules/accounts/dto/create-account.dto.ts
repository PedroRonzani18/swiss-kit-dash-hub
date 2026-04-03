import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';

export enum AccountTypeDto {
  CHECKING = 'checking',
  SAVINGS = 'savings',
  CREDIT_CARD = 'credit_card',
  CASH = 'cash',
}

export class CreateAccountDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  userId: string;

  @ApiProperty({ example: 'Nubank' })
  @IsString()
  @MaxLength(80)
  name: string;

  @ApiProperty({ enum: AccountTypeDto, example: AccountTypeDto.CHECKING })
  @IsEnum(AccountTypeDto)
  type: AccountTypeDto;

  @ApiPropertyOptional({ example: 'BRL', default: 'BRL' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ example: 0, default: 0 })
  @IsOptional()
  @Min(0)
  openingBalanceCents?: number;
}
