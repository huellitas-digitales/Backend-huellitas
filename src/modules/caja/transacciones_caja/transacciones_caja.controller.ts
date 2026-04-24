import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TransaccionesCajaService } from './transacciones_caja.service';
import { CreateTransaccionesCajaDto } from './dto/create-transacciones_caja.dto';
import { UpdateTransaccionesCajaDto } from './dto/update-transacciones_caja.dto';

@Controller('transacciones-caja')
export class TransaccionesCajaController {
  constructor(private readonly transaccionesCajaService: TransaccionesCajaService) {}

  @Post()
  create(@Body() createTransaccionesCajaDto: CreateTransaccionesCajaDto) {
    return this.transaccionesCajaService.create(createTransaccionesCajaDto);
  }

  @Get()
  findAll() {
    return this.transaccionesCajaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transaccionesCajaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransaccionesCajaDto: UpdateTransaccionesCajaDto) {
    return this.transaccionesCajaService.update(+id, updateTransaccionesCajaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transaccionesCajaService.remove(+id);
  }
}
