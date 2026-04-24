import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe /*, UseGuards*/ } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ServiciosService } from './servicios.service';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';

// TODO: DESCOMENTAR AL FINAL - Importaciones de seguridad
// import { JwtAuthGuard } from '../../identidad/auth/guards/jwt.guard';
// import { RolesGuard } from '../../identidad/auth/guards/roles.guard';
// import { Roles } from '../../identidad/auth/decorators/roles.decorator';

@ApiTags('Core - Servicios')
@Controller('servicios')
// TODO: DESCOMENTAR AL FINAL - Activar guardianes
// @UseGuards(JwtAuthGuard, RolesGuard)
export class ServiciosController {
  constructor(private readonly serviciosService: ServiciosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo servicio (Solo Admin)' })
  // TODO: DESCOMENTAR AL FINAL - Restricción de rol
  // @Roles('Administrador') 
  create(@Body() createServicioDto: CreateServicioDto) {
    return this.serviciosService.createServicio(createServicioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los servicios activos' })
  findAll() {
    return this.serviciosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un servicio por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.serviciosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un servicio (Solo Admin)' })
  // TODO: DESCOMENTAR AL FINAL - Restricción de rol
  // @Roles('Administrador') 
  update(@Param('id', ParseIntPipe) id: number, @Body() updateServicioDto: UpdateServicioDto) {
    return this.serviciosService.update(id, updateServicioDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar un servicio (Soft Delete - Solo Admin)' })
  // TODO: DESCOMENTAR AL FINAL - Restricción de rol
  // @Roles('Administrador') 
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.serviciosService.remove(id);
  }
}