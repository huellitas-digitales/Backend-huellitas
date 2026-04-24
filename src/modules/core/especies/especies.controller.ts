import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  UseGuards, ParseIntPipe 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EspeciesService } from './especies.service';
import { CreateEspecieDto } from './dto/create-especie.dto';
import { UpdateEspecieDto } from './dto/update-especie.dto';

// Seguridad de la Fase 0
import { JwtAuthGuard } from '../../identidad/auth/guards/jwt.guard';
import { RolesGuard } from '../../identidad/auth/guards/roles.guard';
import { Roles } from '../../identidad/auth/decorators/roles.decorator';

@ApiTags('Core - Especies') // Para tu Swagger
@ApiBearerAuth()
@Controller('especies')
//@UseGuards(JwtAuthGuard, RolesGuard)
export class EspeciesController {
  constructor(private readonly especiesService: EspeciesService) {}

  @Post()
  //@Roles('Administrador')
  @ApiOperation({ summary: 'Crear una nueva especie (Solo Admin)' })
  create(@Body() createEspecieDto: CreateEspecieDto) {
    // Usamos el método específico con validación de duplicados
    return this.especiesService.createEspecie(createEspecieDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las especies activas' })
  findAll() {
    return this.especiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una especie por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.especiesService.findOne(id);
  }

  @Patch(':id')
 // @Roles('Administrador')
  @ApiOperation({ summary: 'Actualizar una especie (Solo Admin)' })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateEspecieDto: UpdateEspecieDto
  ) {
    return this.especiesService.update(id, updateEspecieDto);
  }

  @Delete(':id')
 // @Roles('Administrador')
  @ApiOperation({ summary: 'Desactivar una especie (Soft Delete - Solo Admin)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.especiesService.remove(id);
  }
}