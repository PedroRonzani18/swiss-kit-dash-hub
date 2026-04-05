import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MaxLength } from 'class-validator';

export enum CategoryTypeDto {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export class CreateCategoryDto {
  @ApiProperty({ example: 'Alimentação' })
  @IsString()
  @MaxLength(80)
  name: string;

  @ApiProperty({ enum: CategoryTypeDto, example: CategoryTypeDto.EXPENSE })
  @IsEnum(CategoryTypeDto)
  type: CategoryTypeDto;
}
