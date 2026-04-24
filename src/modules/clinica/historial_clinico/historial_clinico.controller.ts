import { Controller, Get, Post, Body, Patch, Param, ParseUUIDPipe, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

import { HistorialClinicoService } from './historial_clinico.service';
import { CreateHistorialClinicoDto } from './dto/create-historial_clinico.dto';
import { UpdateHistorialClinicoDto } from './dto/update-historial_clinico.dto';

@ApiTags('Historial Clínico')
@Controller('historial-clinico')
export class HistorialClinicoController {
  constructor(private readonly historialService: HistorialClinicoService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un historial clínico (Solo si la cita está En_Curso)' })
  @ApiResponse({ status: 201, description: 'Historial creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 409, description: 'Conflicto: La cita no está en el estado correcto para generar historial.' })
  create(@Body() createDto: CreateHistorialClinicoDto) {
    return this.historialService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los historiales de la clínica' })
  @ApiResponse({ status: 200, description: 'Lista de historiales obtenida.' })
  findAll() {
    return this.historialService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un historial detallado' })
  @ApiParam({ name: 'id', description: 'UUID del historial clínico' })
  @ApiResponse({ status: 200, description: 'Historial encontrado.' })
  @ApiResponse({ status: 404, description: 'Historial no encontrado.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.historialService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar notas del historial (El diagnóstico es inmutable)' })
  @ApiResponse({ status: 200, description: 'Actualización exitosa.' })
  @ApiResponse({ status: 400, description: 'Intento de modificar campo inmutable.' })
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateDto: UpdateHistorialClinicoDto
  ) {
    return this.historialService.update(id, updateDto);
  }

  @Delete(':id/desactivar')
  @ApiOperation({ summary: 'Desactivar historial clínico (Soft Delete)' })
  @ApiResponse({ status: 200, description: 'Historial desactivado correctamente.' })
  @ApiResponse({ status: 404, description: 'Historial no encontrado.' })
  desactivar(@Param('id', ParseUUIDPipe) id: string) {
    return this.historialService.desactivar(id);
  }
}