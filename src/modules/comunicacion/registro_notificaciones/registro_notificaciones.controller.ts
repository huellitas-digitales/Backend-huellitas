import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RegistroNotificacionesService } from './registro_notificaciones.service';
import { CreateRegistroNotificacioneDto } from './dto/create-registro_notificacione.dto';
import { UpdateRegistroNotificacioneDto } from './dto/update-registro_notificacione.dto';

@Controller('registro-notificaciones')
export class RegistroNotificacionesController {
  constructor(private readonly registroNotificacionesService: RegistroNotificacionesService) {}

  @Post()
  create(@Body() createRegistroNotificacioneDto: CreateRegistroNotificacioneDto) {
    return this.registroNotificacionesService.create(createRegistroNotificacioneDto);
  }

  @Get()
  findAll() {
    return this.registroNotificacionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.registroNotificacionesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRegistroNotificacioneDto: UpdateRegistroNotificacioneDto) {
    return this.registroNotificacionesService.update(+id, updateRegistroNotificacioneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.registroNotificacionesService.remove(+id);
  }
}
