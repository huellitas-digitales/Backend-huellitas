import { Controller, Post, Body, Get, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

import { HorariosAtencionService } from './horarios_atencion.service';
import { CreateHorarioDto } from './dto/create-horarios_atencion.dto';
import { UpdateHorariosAtencionDto } from './dto/update-horarios_atencion.dto';


@ApiTags('Horarios de Atención')
@Controller('horarios-atencion')
export class HorariosAtencionController {
  constructor(private readonly horariosService: HorariosAtencionService) {}

  @Post()
  @ApiOperation({ summary: 'Asignar un nuevo bloque de horario a un veterinario' })
  @ApiResponse({ status: 201, description: 'Horario creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error temporal (Inicio mayor que fin).' })
  @ApiResponse({ status: 409, description: 'Conflicto: El horario se cruza con otro turno del mismo médico.' })
  create(@Body() createHorarioDto: CreateHorarioDto) {
    return this.horariosService.create(createHorarioDto);
  }

  @Get('veterinario/:id')
  @ApiOperation({ summary: 'Obtener todos los horarios activos de un veterinario' })
  @ApiParam({ name: 'id', description: 'UUID del veterinario' })
  @ApiResponse({ status: 200, description: 'Lista de horarios ordenada por día.' })
  findAllByVet(@Param('id', ParseUUIDPipe) id: string) {
    return this.horariosService.findAllByVeterinario(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modificar un horario existente' })
  @ApiParam({ name: 'id', description: 'UUID del horario a modificar' })
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateHorarioDto: UpdateHorariosAtencionDto // Asegúrate de tener este DTO creado
  ) {
    return this.horariosService.update(id, updateHorarioDto);
  }

  @Patch(':id/desactivar')
  @ApiOperation({ summary: 'Desactivar un horario (Soft Delete)' })
  @ApiParam({ name: 'id', description: 'UUID del horario a desactivar' })
  desactivar(@Param('id', ParseUUIDPipe) id: string) {
    return this.horariosService.desactivar(id);
  }
}