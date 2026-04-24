import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VacunasAplicadasService } from './vacunas_aplicadas.service';
import { CreateVacunasAplicadaDto } from './dto/create-vacunas_aplicada.dto';
import { UpdateVacunasAplicadaDto } from './dto/update-vacunas_aplicada.dto';

@Controller('vacunas-aplicadas')
export class VacunasAplicadasController {
  constructor(private readonly vacunasAplicadasService: VacunasAplicadasService) {}

  @Post()
  create(@Body() createVacunasAplicadaDto: CreateVacunasAplicadaDto) {
    return this.vacunasAplicadasService.create(createVacunasAplicadaDto);
  }

  @Get()
  findAll() {
    return this.vacunasAplicadasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vacunasAplicadasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVacunasAplicadaDto: UpdateVacunasAplicadaDto) {
    return this.vacunasAplicadasService.update(+id, updateVacunasAplicadaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vacunasAplicadasService.remove(+id);
  }
}
