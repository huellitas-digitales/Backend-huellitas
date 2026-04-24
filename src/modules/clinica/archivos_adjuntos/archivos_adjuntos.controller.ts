import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ArchivosAdjuntosService } from './archivos_adjuntos.service';
import { CreateArchivosAdjuntoDto } from './dto/create-archivos_adjunto.dto';
import { UpdateArchivosAdjuntoDto } from './dto/update-archivos_adjunto.dto';

@Controller('archivos-adjuntos')
export class ArchivosAdjuntosController {
  constructor(private readonly archivosAdjuntosService: ArchivosAdjuntosService) {}

  @Post()
  create(@Body() createArchivosAdjuntoDto: CreateArchivosAdjuntoDto) {
    return this.archivosAdjuntosService.create(createArchivosAdjuntoDto);
  }

  @Get()
  findAll() {
    return this.archivosAdjuntosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.archivosAdjuntosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArchivosAdjuntoDto: UpdateArchivosAdjuntoDto) {
    return this.archivosAdjuntosService.update(+id, updateArchivosAdjuntoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.archivosAdjuntosService.remove(+id);
  }
}
