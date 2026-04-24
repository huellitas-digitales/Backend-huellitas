import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MascotasService } from './mascotas.service';
import { CreateMascotaDto } from './dto/create-mascota.dto';
import { UpdateMascotaDto } from './dto/update-mascota.dto';

// 🛡️ Importaciones de Seguridad
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Identidad - Mascotas')
@ApiBearerAuth('access-token') // Candado en Swagger
@UseGuards(JwtAuthGuard, RolesGuard) // Activa la seguridad global del controlador
@Controller('mascotas')
export class MascotasController {
  constructor(private readonly mascotasService: MascotasService) {}

  @Post()
  @Roles('Administrador', 'Cajero') // El staff de recepción registra pacientes
  @ApiOperation({ summary: 'Registrar nueva mascota y generar QR' })
  create(
    @Body() createMascotaDto: CreateMascotaDto,
    @CurrentUser('id') userId: string // 👈 Atrapamos el ID del usuario
  ) {
    return this.mascotasService.createMascota(createMascotaDto, userId);
  }

  @Get()
  @Roles('Administrador', 'Veterinario', 'Cajero')
  @ApiOperation({ summary: 'Listar todas las mascotas' })
  findAll() {
    return this.mascotasService.findAllClean();
  }

  @Get(':id')
  @Roles('Administrador', 'Veterinario', 'Cajero')
  @ApiOperation({ summary: 'Obtener mascota por ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.mascotasService.findOne(id);
  }

  @Patch(':id')
  @Roles('Administrador', 'Veterinario') // Los doctores pueden actualizar peso, esterilización, etc.
  @ApiOperation({ summary: 'Actualizar datos básicos de una mascota' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateMascotaDto: UpdateMascotaDto) {
    return this.mascotasService.update(id, updateMascotaDto);
  }

  @Delete(':id')
  @Roles('Administrador') // Solo jefes borran pacientes
  @ApiOperation({ summary: 'Eliminar registro de mascota' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.mascotasService.remove(id);
  }
}