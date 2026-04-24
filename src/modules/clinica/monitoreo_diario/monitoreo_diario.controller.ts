import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MonitoreoDiarioService } from './monitoreo_diario.service';
import { CreateMonitoreoDiarioDto } from './dto/create-monitoreo_diario.dto';
import { UpdateMonitoreoDiarioDto } from './dto/update-monitoreo_diario.dto';

@Controller('monitoreo-diario')
export class MonitoreoDiarioController {
  constructor(private readonly monitoreoDiarioService: MonitoreoDiarioService) {}

  @Post()
  create(@Body() createMonitoreoDiarioDto: CreateMonitoreoDiarioDto) {
    return this.monitoreoDiarioService.create(createMonitoreoDiarioDto);
  }

  @Get()
  findAll() {
    return this.monitoreoDiarioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.monitoreoDiarioService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMonitoreoDiarioDto: UpdateMonitoreoDiarioDto) {
    return this.monitoreoDiarioService.update(+id, updateMonitoreoDiarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.monitoreoDiarioService.remove(+id);
  }
}
