import { ApiProperty } from '@nestjs/swagger';

export class HorariosAtencionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  id_veterinario_fk: string;

  @ApiProperty()
  dia_semana: number;

  @ApiProperty()
  hora_inicio: string;

  @ApiProperty()
  hora_fin: string;

  @ApiProperty()
  activo: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  createdBy: string;
}
