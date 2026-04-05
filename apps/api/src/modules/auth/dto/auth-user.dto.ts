import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'pedroaugustogabironzani@gmail.com' })
  email: string;

  @ApiProperty({ nullable: true, example: 'Pedro Ronzani' })
  name: string | null;

  @ApiProperty({ example: 'google' })
  provider: string;
}
