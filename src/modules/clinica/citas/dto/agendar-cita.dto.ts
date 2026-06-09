import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class AgendarCitaDto {
  @ApiProperty({ example: '2026-06-10', description: 'Fecha de la cita en formato YYYY-MM-DD' })
  @IsDateString({}, { message: 'La fecha debe ser una cadena ISO válida' })
  fecha: string;

  @ApiProperty({ example: 'Pardo', description: 'Nombre de la mascota' })
  @IsString({ message: 'La mascota debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre de la mascota es obligatorio' })
  mascota: string;

  @ApiProperty({ example: 'Chequeo', description: 'Motivo de la cita' })
  @IsString({ message: 'El motivo debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El motivo es obligatorio' })
  @MaxLength(150, { message: 'El motivo no puede superar 150 caracteres' })
  motivo: string;
}
