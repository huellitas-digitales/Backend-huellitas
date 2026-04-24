import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LotesCaducidadService } from './lotes_caducidad.service';
import { CreateLotesCaducidadDto } from './dto/create-lotes_caducidad.dto';
import { UpdateLotesCaducidadDto } from './dto/update-lotes_caducidad.dto';

@Controller('lotes-caducidad')
export class LotesCaducidadController {
  constructor(private readonly lotesCaducidadService: LotesCaducidadService) {}

  @Post()
  create(@Body() createLotesCaducidadDto: CreateLotesCaducidadDto) {
    return this.lotesCaducidadService.create(createLotesCaducidadDto);
  }

  @Get()
  findAll() {
    return this.lotesCaducidadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lotesCaducidadService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLotesCaducidadDto: UpdateLotesCaducidadDto) {
    return this.lotesCaducidadService.update(+id, updateLotesCaducidadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lotesCaducidadService.remove(+id);
  }
}
