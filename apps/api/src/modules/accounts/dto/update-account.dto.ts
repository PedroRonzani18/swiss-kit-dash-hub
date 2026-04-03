import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { AccountTypeDto } from './create-account.dto';

export class UpdateAccountDto {
  @ApiPropertyOptional({ example: 'Conta principal' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  name?: string;

  @ApiPropertyOptional({ enum: AccountTypeDto })
  @IsOptional()
  @IsEnum(AccountTypeDto)
  type?: AccountTypeDto;

  @ApiPropertyOptional({ example: 'BRL' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ example: 5000 })
  @IsOptional()
  @Min(0)
  openingBalanceCents?: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;
}
