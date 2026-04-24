// src/modules/clinica/citas/dto/update-estado-cita.dto.ts
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum EstadoCitaPermitido {
  Pendiente = 'Pendiente',
  En_Curso = 'En_Curso',
  Completada = 'Completada',
  Cancelada = 'Cancelada',
  No_Asistio = 'No_Asistio',
}

export class UpdateEstadoCitaDto {
  @ApiProperty({
    enum: EstadoCitaPermitido,
    example: EstadoCitaPermitido.En_Curso,
    description: 'El nuevo estado hacia el que transitará la cita'
  })
  @IsEnum(EstadoCitaPermitido, { 
    message: 'El estado proporcionado no es un estado válido del sistema.' 
  })
  estado: EstadoCitaPermitido;
}