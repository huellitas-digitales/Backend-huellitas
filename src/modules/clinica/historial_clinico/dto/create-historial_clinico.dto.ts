// src/modules/clinica/historial_clinico/dto/create-historial.dto.ts
import { IsUUID, IsNumber, IsString, IsOptional, Min, MaxLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHistorialClinicoDto {
  @ApiProperty({ example: 'Control mensual y revisión de piel' })
  @IsString()
  @IsNotEmpty({ message: 'El motivo de la consulta no puede estar vacío.' })
  @MaxLength(255)
  motivo_consulta: string;

  @ApiProperty({ example: 'Comezón leve, pérdida de pelo en el lomo' })
  @IsString()
  @IsOptional()
  sintomas?: string;

  @ApiProperty({ example: 12.5 })
  @IsNumber()
  @Min(0.1, { message: 'El peso debe ser mayor a 0.' })
  peso_actual_kg: number;

  @ApiProperty({ example: 'Dermatitis atópica por alergia a pulgas' })
  @IsString()
  @IsNotEmpty({ message: 'El diagnóstico es obligatorio.' })
  diagnostico: string;

  @ApiProperty({ example: 'Se recomienda bañar con champú especial' })
  @IsString()
  @IsOptional()
  notas_internas?: string;

  // 👇 ¡LA ÚNICA LLAVE FORÁNEA NECESARIA Y ES OBLIGATORIA!
  @ApiProperty({ example: 'uuid-cita' })
  @IsUUID('4', { message: 'Debe enviar un ID de cita válido.' })
  id_cita_fk: string; 
}