import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRazasDto {
  @ApiProperty({ example: 'Golden Retriever' })
  @IsString()
  nombre_raza: string;

  @ApiProperty({ example: 'uuid-especie' })
  @IsUUID('4')
  id_especie_fk: string;
}
