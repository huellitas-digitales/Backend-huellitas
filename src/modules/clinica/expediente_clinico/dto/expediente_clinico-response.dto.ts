import { ApiProperty } from '@nestjs/swagger';

export class ExpedienteClinicoResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  id_mascota_fk: string;

  @ApiProperty()
  fecha_apertura: Date;

  @ApiProperty()
  notas_generales: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  updatedBy: string;
}
