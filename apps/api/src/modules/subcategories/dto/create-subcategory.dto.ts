import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateSubcategoryDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  userId: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  categoryId: string;

  @ApiProperty({ example: 'Supermercado' })
  @IsString()
  @MaxLength(80)
  name: string;
}
