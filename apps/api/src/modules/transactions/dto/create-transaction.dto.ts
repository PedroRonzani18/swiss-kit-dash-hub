import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export class CreateTransactionDto {
  @ApiProperty({ enum: TransactionType, example: TransactionType.EXPENSE })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ example: 1500 })
  @IsInt()
  @Min(1)
  amountCents: number;

  @ApiProperty({ example: 'account-id' })
  @IsString()
  accountId: string;

  @ApiProperty({ example: 'category-id' })
  @IsString()
  categoryId: string;

  @ApiPropertyOptional({ example: 'subcategory-id' })
  @IsOptional()
  @IsString()
  subcategoryId?: string;

  @ApiProperty({ example: '2026-04-02T12:00:00.000Z' })
  @IsDateString()
  occurredAt: string;

  @ApiPropertyOptional({ example: 'Gasolina complemento' })
  @IsOptional()
  @IsString()
  note?: string;
}
