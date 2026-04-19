import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateTransactionDto } from './create-transaction.dto';

export class CreateTransactionBulkDto {
  @ApiProperty({ type: [CreateTransactionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTransactionDto)
  items: CreateTransactionDto[];
}
