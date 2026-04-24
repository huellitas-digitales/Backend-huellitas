import { IsUUID, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHospitalizacionesDto {
  @ApiProperty({ example: 'uuid-historial' })
  @IsUUID('4')
  id_historial_fk: string;

  @ApiProperty({ example: 'uuid-mascota' })
  @IsUUID('4')
  id_mascota_fk: string;

  @ApiProperty({ example: 'uuid-veterinario' })
  @IsUUID('4')
  id_veterinario_responsable: string;

  @ApiProperty({ example: 'Fractura en pata trasera' })
  @IsString()
  motivo_ingreso: string;

  @ApiProperty({ example: 'Observacion' })
  @IsString()
  estado_actual: string;

  @ApiProperty({ example: 150.00 })
  @IsNumber()
  costo_por_dia: number;
}
