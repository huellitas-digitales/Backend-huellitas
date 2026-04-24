import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEspecieDto {
  @ApiProperty({ example: 'Perro', description: 'Nombre de la especie' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  nombre: string;
}