import { ApiProperty } from '@nestjs/swagger';

export class MonitoreoDiarioResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  id_hospitaliza_fk: string;

  @ApiProperty()
  id_veterinario_fk: string;

  @ApiProperty()
  turno: string;

  @ApiProperty()
  temperatura_c: number;

  @ApiProperty()
  freq_cardiaca: number;

  @ApiProperty()
  freq_respiratoria: number;

  @ApiProperty()
  observaciones: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  createdBy: string;
}
