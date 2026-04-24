import { ApiProperty } from '@nestjs/swagger';

export class CatalogoVacunasResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nombre_vacuna: string;

  @ApiProperty()
  descripcion: string;

  @ApiProperty()
  intervalo_revacunacion: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
