import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HospitalizacionesService } from './hospitalizaciones.service';
import { CreateHospitalizacioneDto } from './dto/create-hospitalizacione.dto';
import { UpdateHospitalizacioneDto } from './dto/update-hospitalizacione.dto';

@Controller('hospitalizaciones')
export class HospitalizacionesController {
  constructor(private readonly hospitalizacionesService: HospitalizacionesService) {}

  @Post()
  create(@Body() createHospitalizacioneDto: CreateHospitalizacioneDto) {
    return this.hospitalizacionesService.create(createHospitalizacioneDto);
  }

  @Get()
  findAll() {
    return this.hospitalizacionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hospitalizacionesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHospitalizacioneDto: UpdateHospitalizacioneDto) {
    return this.hospitalizacionesService.update(+id, updateHospitalizacioneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hospitalizacionesService.remove(+id);
  }
}
