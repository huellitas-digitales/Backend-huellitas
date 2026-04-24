import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRegistroNotificacionesDto {
  @ApiProperty({ example: 'Enviado', required: false })
  @IsString()
  @IsOptional()
  estado_envio?: string;
}
