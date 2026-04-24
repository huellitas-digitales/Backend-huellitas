import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe /*, UseGuards*/ } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CategoriasProductoService } from './categorias_productos.service';
import { CreateCategoriaProductoDto } from './dto/create-categorias_producto.dto';
import { UpdateCategoriasProductoDto } from './dto/update-categorias_producto.dto';

// TODO: DESCOMENTAR AL FINAL - Seguridad
// import { JwtAuthGuard } from '../../identidad/auth/guards/jwt.guard';
// import { RolesGuard } from '../../identidad/auth/guards/roles.guard';
// import { Roles } from '../../identidad/auth/decorators/roles.decorator';

@ApiTags('Core - Categorías de Producto')
@Controller('categorias-producto')
// TODO: DESCOMENTAR AL FINAL
// @UseGuards(JwtAuthGuard, RolesGuard)
export class CategoriasProductoController {
  constructor(private readonly categoriasService: CategoriasProductoService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva categoría (Solo Admin)' })
  // TODO: DESCOMENTAR AL FINAL
  // @Roles('Administrador') 
  create(@Body() createCategoriaProductoDto: CreateCategoriaProductoDto) {
    return this.categoriasService.createCategoria(createCategoriaProductoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las categorías activas' })
  findAll() {
    return this.categoriasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una categoría por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una categoría (Solo Admin)' })
  // TODO: DESCOMENTAR AL FINAL
  // @Roles('Administrador') 
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCategoriasProductoDto: UpdateCategoriasProductoDto) {
    return this.categoriasService.update(id, updateCategoriasProductoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar una categoría (Soft Delete - Solo Admin)' })
  // TODO: DESCOMENTAR AL FINAL
  // @Roles('Administrador') 
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriasService.remove(id);
  }
}