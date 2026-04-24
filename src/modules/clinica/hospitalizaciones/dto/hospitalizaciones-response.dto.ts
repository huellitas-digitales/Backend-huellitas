import { ApiProperty } from '@nestjs/swagger';

export class HospitalizacionesResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  id_historial_fk: string;

  @ApiProperty()
  id_mascota_fk: string;

  @ApiProperty()
  id_veterinario_responsable: string;

  @ApiProperty()
  fecha_ingreso: Date;

  @ApiProperty()
  fecha_alta: Date;

  @ApiProperty()
  motivo_ingreso: string;

  @ApiProperty()
  estado_actual: string;

  @ApiProperty()
  costo_por_dia: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  createdBy: string;
}
