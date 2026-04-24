import { IsString, IsNotEmpty, MaxLength, IsOptional, IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCatalogoVacunaDto {
  @ApiProperty({ example: 'Antirrábica Canina', description: 'Nombre de la vacuna' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la vacuna es obligatorio' })
  @MaxLength(150)
  nombre: string;

  @ApiProperty({ example: 'Prevención contra la rabia', required: false })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiProperty({ example: 365, description: 'Días que deben pasar para la siguiente dosis' })
  @IsInt()
  @IsPositive({ message: 'Los días para el refuerzo deben ser un número positivo' })
  dias_para_refuerzo: number;

  @ApiProperty({ example: 1, description: 'ID de la especie destino (Ej: 1 para Perro)' })
  @IsInt()
  @IsPositive()
  id_especie_fk: number;
}