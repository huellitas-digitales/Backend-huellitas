import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe /*, UseGuards*/ } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CatalogoVacunasService } from './catalogo_vacunas.service';
import { CreateCatalogoVacunaDto } from './dto/create-catalogo_vacuna.dto';
import { UpdateCatalogoVacunaDto } from './dto/update-catalogo_vacuna.dto';

// TODO: DESCOMENTAR AL FINAL
// import { JwtAuthGuard } from '../../identidad/auth/guards/jwt.guard';
// import { RolesGuard } from '../../identidad/auth/guards/roles.guard';
// import { Roles } from '../../identidad/auth/decorators/roles.decorator';

@ApiTags('Core - Catálogo de Vacunas')
@Controller('catalogo-vacunas')
// TODO: DESCOMENTAR AL FINAL
// @UseGuards(JwtAuthGuard, RolesGuard)
export class CatalogoVacunasController {
  constructor(private readonly vacunasService: CatalogoVacunasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva vacuna maestra (Solo Admin)' })
  // TODO: DESCOMENTAR AL FINAL
  // @Roles('Administrador') 
  create(@Body() createDto: CreateCatalogoVacunaDto) {
    return this.vacunasService.createVacuna(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las vacunas' })
  findAll() {
    return this.vacunasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener vacuna por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vacunasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una vacuna (Solo Admin)' })
  // TODO: DESCOMENTAR AL FINAL
  // @Roles('Administrador') 
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateCatalogoVacunaDto) {
    return this.vacunasService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar una vacuna (Soft Delete - Solo Admin)' })
  // TODO: DESCOMENTAR AL FINAL
  // @Roles('Administrador') 
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.vacunasService.remove(id);
  }
}