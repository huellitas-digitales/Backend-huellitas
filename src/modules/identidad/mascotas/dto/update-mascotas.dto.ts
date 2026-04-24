import { IsString, IsOptional} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMascotasDto {
  @ApiProperty({ example: 'Firulais actualizado', required: false })
  @IsString()
  @IsOptional()
  nombre_mascota?: string;

  @ApiProperty({ example: 'https://huellitas.pe/perfiles/firulais-updated', required: false })
  @IsString()
  @IsOptional()
  url_perfil_publico?: string;

  @ApiProperty({ example: 'Color blanco, negro y café', required: false })
  @IsString()
  @IsOptional()
  caracteristicas_fisicas?: string;

  @ApiProperty({ example: 16.0, required: false })
  @IsOptional()
  peso_kg?: number;
}
