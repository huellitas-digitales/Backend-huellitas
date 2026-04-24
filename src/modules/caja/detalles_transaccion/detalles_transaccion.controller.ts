import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DetallesTransaccionService } from './detalles_transaccion.service';
import { CreateDetallesTransaccionDto } from './dto/create-detalles_transaccion.dto';
import { UpdateDetallesTransaccionDto } from './dto/update-detalles_transaccion.dto';

@Controller('detalles-transaccion')
export class DetallesTransaccionController {
  constructor(private readonly detallesTransaccionService: DetallesTransaccionService) {}

  @Post()
  create(@Body() createDetallesTransaccionDto: CreateDetallesTransaccionDto) {
    return this.detallesTransaccionService.create(createDetallesTransaccionDto);
  }

  @Get()
  findAll() {
    return this.detallesTransaccionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detallesTransaccionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDetallesTransaccionDto: UpdateDetallesTransaccionDto) {
    return this.detallesTransaccionService.update(+id, updateDetallesTransaccionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detallesTransaccionService.remove(+id);
  }
}
