import { IsUUID, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRecetasDto {
  @ApiProperty({ example: 'uuid-historial' })
  @IsUUID('4')
  id_historial_fk: string;

  @ApiProperty({ example: 'uuid-veterinario' })
  @IsUUID('4')
  id_veterinario_fk: string;

  @ApiProperty({ example: 'Aplicar dos veces al día', required: false })
  @IsString()
  @IsOptional()
  indicaciones_grales?: string;
}
