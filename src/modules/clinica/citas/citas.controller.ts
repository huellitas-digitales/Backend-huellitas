// src/modules/clinica/citas/citas.controller.ts
import { Controller, Post, Body, Patch, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

import { CitasService } from './citas.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateEstadoCitaDto } from './dto/update-estado-cita.dto';

@ApiTags('Citas Médicas') // <-- Nombre de la sección en Swagger
@Controller('citas')
export class CitasController {
  constructor(private readonly citasService: CitasService) {}

  @Post()
  @ApiOperation({ summary: 'Agendar una nueva cita médica' })
  @ApiResponse({ status: 201, description: 'La cita fue agendada exitosamente sin colisiones.' })
  @ApiResponse({ status: 400, description: 'Error de validación (fuera de horario o datos faltantes).' })
  @ApiResponse({ status: 409, description: 'Conflicto: El horario choca con otra cita.' })
  create(@Body() createCitaDto: CreateCitaDto) {
    return this.citasService.create(createCitaDto);
  }

  @Patch(':id/estado')
  @ApiOperation({ summary: 'Actualizar el estado de una cita (Máquina de Estados)' })
  @ApiParam({ name: 'id', description: 'UUID de la cita a modificar' })
  @ApiResponse({ status: 200, description: 'Estado actualizado correctamente.' })
  @ApiResponse({ status: 400, description: 'Transición de estado inválida.' })
  @ApiResponse({ status: 404, description: 'Cita no encontrada.' })
  cambiarEstado(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEstadoDto: UpdateEstadoCitaDto
  ) {
    return this.citasService.cambiarEstado(id, updateEstadoDto.estado);
  }
}