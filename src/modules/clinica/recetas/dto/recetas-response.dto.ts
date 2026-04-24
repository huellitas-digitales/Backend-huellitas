import { ApiProperty } from '@nestjs/swagger';

export class RecetasResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  id_historial_fk: string;

  @ApiProperty()
  id_veterinario_fk: string;

  @ApiProperty()
  indicaciones_grales: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  updatedBy: string;
}
