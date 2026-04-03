import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';
import { TransactionTypeDto } from './create-transaction.dto';

export class UpdateTransactionDto {
  @ApiPropertyOptional({ enum: TransactionTypeDto })
  @IsOptional()
  @IsEnum(TransactionTypeDto)
  type?: TransactionTypeDto;

  @ApiPropertyOptional({ example: 1599 })
  @IsOptional()
  @IsInt()
  @Min(1)
  amountCents?: number;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  accountId?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({
    format: 'uuid',
    nullable: true,
    description: 'Set null to remove subcategory',
  })
  @IsOptional()
  @IsUUID()
  subcategoryId?: string | null;

  @ApiPropertyOptional({ example: '2026-04-03T09:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  occurredAt?: string;

  @ApiPropertyOptional({ example: 'Ajuste manual', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  note?: string | null;
}
