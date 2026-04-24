import { ApiProperty } from '@nestjs/swagger';

export class DetallesRecetaResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  id_receta_fk: string;

  @ApiProperty()
  id_producto_fk: string;

  @ApiProperty()
  medicamento_texto: string;

  @ApiProperty()
  dosis: string;

  @ApiProperty()
  frecuencia: string;

  @ApiProperty()
  duracion_dias: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  createdBy: string;
}
