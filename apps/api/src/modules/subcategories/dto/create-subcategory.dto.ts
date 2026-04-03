import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateSubcategoryDto {
  @ApiProperty({ example: 'Supermercado' })
  @IsString()
  @MaxLength(80)
  name: string;

  @ApiProperty({ example: 'category-id' })
  @IsString()
  categoryId: string;
}
