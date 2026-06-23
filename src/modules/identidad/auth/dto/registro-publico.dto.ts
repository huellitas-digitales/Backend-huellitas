import {
  IsString, IsNotEmpty, IsEmail, MinLength, MaxLength,
  IsOptional, IsIn, IsBoolean, IsInt, ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class MascotaRegistroDto {
  @ApiProperty({ example: 'Rocky' })
  @IsString() @IsNotEmpty() @MaxLength(100)
  nombre: string;

  @ApiProperty({ example: 'M', description: 'M = Macho, H = Hembra' })
  @IsString() @IsNotEmpty() @IsIn(['M', 'H'])
  sexo: string;

  @ApiProperty({ example: 1, description: 'ID de la raza seleccionada', required: false })
  @IsInt() @IsOptional()
  id_raza_fk?: number;

  @ApiProperty({ example: '2020-05-15', required: false })
  @IsString() @IsOptional()
  fecha_nacimiento?: string;

  @ApiProperty({ example: false, required: false })
  @IsBoolean() @IsOptional()
  esterilizado?: boolean;

  @ApiProperty({ example: 'https://...foto.jpg', required: false })
  @IsString() @IsOptional() @MaxLength(500)
  foto_url?: string;

  @ApiProperty({ example: 'Pelaje dorado, collar rojo, mancha blanca en el pecho', required: false })
  @IsString() @IsOptional()
  caracteristicas_fisicas?: string;
}

export class RegistroPublicoDto {
  @ApiProperty({ example: 'Juan' })
  @IsString() @IsNotEmpty() @MaxLength(100)
  nombres: string;

  @ApiProperty({ example: 'Pérez' })
  @IsString() @IsNotEmpty() @MaxLength(100)
  apellidos: string;

  @ApiProperty({ example: 'juan@ejemplo.com' })
  @IsEmail() @MaxLength(150)
  email: string;

  @ApiProperty({ example: 'MiPassword123' })
  @IsString() @MinLength(8)
  password: string;

  @ApiProperty({ example: '77234567', required: false })
  @IsString() @IsOptional() @MaxLength(20)
  telefono?: string;

  @ApiProperty({ example: 'https://...avatar.jpg', required: false })
  @IsString() @IsOptional() @MaxLength(500)
  avatar_url?: string;

  @ApiProperty({ type: () => MascotaRegistroDto })
  @ValidateNested()
  @Type(() => MascotaRegistroDto)
  mascota: MascotaRegistroDto;
}
