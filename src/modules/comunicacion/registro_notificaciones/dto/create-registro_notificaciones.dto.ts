import { IsString, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRegistroNotificacionesDto {
  @ApiProperty({ example: 'Recordatorio de cita' })
  @IsString()
  tipo_notificacion: string;

  @ApiProperty({ example: 'WhatsApp' })
  @IsString()
  canal_envio: string;

  @ApiProperty({ example: 'Recordatorio: Tu cita es mañana a las 10:00' })
  @IsString()
  cuerpo_mensaje: string;

  @ApiProperty({ example: 'Pendiente' })
  @IsString()
  estado_envio: string;

  @ApiProperty({ example: 'uuid-usuario', required: false })
  @IsUUID('4')
  @IsOptional()
  id_usuario_fk?: string;

  @ApiProperty({ example: 'uuid-cita', required: false })
  @IsUUID('4')
  @IsOptional()
  id_cita_fk?: string;

  @ApiProperty({ example: 'uuid-mascota', required: false })
  @IsUUID('4')
  @IsOptional()
  id_mascota_fk?: string;
}
