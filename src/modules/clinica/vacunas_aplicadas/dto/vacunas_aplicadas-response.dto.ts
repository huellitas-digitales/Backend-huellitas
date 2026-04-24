import { ApiProperty } from '@nestjs/swagger';

export class VacunasAplicadasResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  id_historial_fk: string;

  @ApiProperty()
  id_vacuna_fk: number;

  @ApiProperty()
  id_veterinario_fk: string;

  @ApiProperty()
  fecha_aplicacion: Date;

  @ApiProperty()
  fecha_proxima_dosis: Date;

  @ApiProperty()
  peso_mascota_kg: number;

  @ApiProperty()
  lote_vacuna: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  createdBy: string;
}
