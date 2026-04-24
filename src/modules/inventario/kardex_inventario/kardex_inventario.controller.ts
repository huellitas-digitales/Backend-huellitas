import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { KardexInventarioService } from './kardex_inventario.service';
import { CreateKardexInventarioDto } from './dto/create-kardex_inventario.dto';
import { UpdateKardexInventarioDto } from './dto/update-kardex_inventario.dto';

@Controller('kardex-inventario')
export class KardexInventarioController {
  constructor(private readonly kardexInventarioService: KardexInventarioService) {}

  @Post()
  create(@Body() createKardexInventarioDto: CreateKardexInventarioDto) {
    return this.kardexInventarioService.create(createKardexInventarioDto);
  }

  @Get()
  findAll() {
    return this.kardexInventarioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kardexInventarioService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKardexInventarioDto: UpdateKardexInventarioDto) {
    return this.kardexInventarioService.update(+id, updateKardexInventarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kardexInventarioService.remove(+id);
  }
}
