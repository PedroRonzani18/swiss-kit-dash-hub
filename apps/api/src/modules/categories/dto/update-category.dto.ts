import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { CategoryTypeDto } from './create-category.dto';

export class UpdateCategoryDto {
  @ApiPropertyOptional({ example: 'Mercado' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  name?: string;

  @ApiPropertyOptional({ enum: CategoryTypeDto })
  @IsOptional()
  @IsEnum(CategoryTypeDto)
  type?: CategoryTypeDto;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;
}
