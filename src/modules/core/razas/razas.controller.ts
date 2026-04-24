import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe /*, UseGuards*/ } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RazasService } from './razas.service';
import { CreateRazaDto } from './dto/create-raza.dto';
import { UpdateRazaDto } from './dto/update-raza.dto';

// TODO: DESCOMENTAR AL FINAL - Importaciones de seguridad
// import { JwtAuthGuard } from '../../identidad/auth/guards/jwt.guard';
// import { RolesGuard } from '../../identidad/auth/guards/roles.guard';
// import { Roles } from '../../identidad/auth/decorators/roles.decorator';

@ApiTags('Core - Razas')
@Controller('razas')
// TODO: DESCOMENTAR AL FINAL - Activar guardianes
// @UseGuards(JwtAuthGuard, RolesGuard)
export class RazasController {
  constructor(private readonly razasService: RazasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva raza (Solo Admin)' })
  // TODO: DESCOMENTAR AL FINAL - Restricción de rol
  // @Roles('Administrador') 
  create(@Body() createRazaDto: CreateRazaDto) {
    return this.razasService.createRaza(createRazaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las razas activas' })
  findAll() {
    return this.razasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una raza por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.razasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una raza (Solo Admin)' })
  // TODO: DESCOMENTAR AL FINAL - Restricción de rol
  // @Roles('Administrador') 
  update(@Param('id', ParseIntPipe) id: number, @Body() updateRazaDto: UpdateRazaDto) {
    return this.razasService.update(id, updateRazaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar una raza (Soft Delete - Solo Admin)' })
  // TODO: DESCOMENTAR AL FINAL - Restricción de rol
  // @Roles('Administrador') 
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.razasService.remove(id);
  }
}