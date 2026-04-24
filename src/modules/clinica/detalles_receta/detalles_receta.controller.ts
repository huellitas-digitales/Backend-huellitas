import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DetallesRecetaService } from './detalles_receta.service';
import { CreateDetallesRecetaDto } from './dto/create-detalles_receta.dto';
import { UpdateDetallesRecetaDto } from './dto/update-detalles_receta.dto';

@Controller('detalles-receta')
export class DetallesRecetaController {
  constructor(private readonly detallesRecetaService: DetallesRecetaService) {}

  @Post()
  create(@Body() createDetallesRecetaDto: CreateDetallesRecetaDto) {
    return this.detallesRecetaService.create(createDetallesRecetaDto);
  }

  @Get()
  findAll() {
    return this.detallesRecetaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detallesRecetaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDetallesRecetaDto: UpdateDetallesRecetaDto) {
    return this.detallesRecetaService.update(+id, updateDetallesRecetaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detallesRecetaService.remove(+id);
  }
}
