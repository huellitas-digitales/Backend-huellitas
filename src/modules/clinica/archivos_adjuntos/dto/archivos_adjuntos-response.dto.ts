import { ApiProperty } from '@nestjs/swagger';

export class ArchivosAdjuntosResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  id_historial_fk: string;

  @ApiProperty()
  url_archivo: string;

  @ApiProperty()
  nombre_archivo: string;

  @ApiProperty()
  tipo_archivo: string;

  @ApiProperty()
  tipo_estudio: string;

  @ApiProperty()
  origen: string;

  @ApiProperty()
  estado_archivo: string;

  @ApiProperty()
  fecha_estudio: Date;

  @ApiProperty()
  observaciones: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  createdBy: string;
}
