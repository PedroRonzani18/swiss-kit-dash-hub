import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';

export enum TransactionTypeDto {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export class CreateTransactionDto {
  @ApiProperty({
    enum: TransactionTypeDto,
    example: TransactionTypeDto.EXPENSE,
  })
  @IsEnum(TransactionTypeDto)
  type: TransactionTypeDto;

  @ApiProperty({ example: 1500 })
  @IsInt()
  @Min(1)
  amountCents: number;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  accountId: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  categoryId: string;

  @ApiPropertyOptional({ format: 'uuid', nullable: true })
  @IsOptional()
  @IsUUID()
  subcategoryId?: string | null;

  @ApiProperty({ example: '2026-04-02T12:00:00.000Z' })
  @IsDateString()
  occurredAt: string;

  @ApiPropertyOptional({ example: 'Gasolina complemento', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  note?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'When true, create installments from this transaction',
  })
  @IsOptional()
  @IsBoolean()
  installmentEnabled?: boolean;

  @ApiPropertyOptional({
    example: 12,
    minimum: 2,
    description: 'Required when installmentEnabled is true',
  })
  @ValidateIf((dto: CreateTransactionDto) => dto.installmentEnabled === true)
  @IsInt()
  @Min(2)
  installmentCount?: number;
}
