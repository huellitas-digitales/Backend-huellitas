import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

// 🛡️ Importaciones de Seguridad
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Identidad - Usuarios')
@ApiBearerAuth('access-token') // Candado en Swagger
@UseGuards(JwtAuthGuard, RolesGuard) // Activa la seguridad global del controlador
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @Roles('Administrador', 'Cajero') // Solo staff autorizado crea usuarios
  @ApiOperation({ summary: 'Crear usuario (Cajero solo crea Clientes)' })
  create(
    @Body() createUsuarioDto: CreateUsuarioDto,
    @CurrentUser() usuario: any // 👈 Atrapamos todo el usuario (ID y Rol)
  ) {
    // Le pasamos los datos reales del usuario que hizo la petición
    return this.usuariosService.createUsuario(
      createUsuarioDto, 
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      usuario.id, 
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      usuario.rol
    );
  }

  @Get()
  @Roles('Administrador', 'Veterinario', 'Cajero')
  @ApiOperation({ summary: 'Listar todos los usuarios activos' })
  findAll() {
    return this.usuariosService.findAllClean();
  }

  @Get(':id')
  @Roles('Administrador', 'Veterinario', 'Cajero')
  @ApiOperation({ summary: 'Obtener un usuario por UUID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usuariosService.findOneClean(id);
  }

  @Patch(':id')
  @Roles('Administrador') // Solo Admin edita perfiles de otros
  @ApiOperation({ summary: 'Actualizar datos de un usuario' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  @Roles('Administrador') // Solo Admin suspende cuentas
  @ApiOperation({ summary: 'Suspender una cuenta de usuario (Soft Delete)' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') adminId: string // 👈 Atrapamos solo el ID para la trazabilidad
  ) {
    return this.usuariosService.suspenderCuenta(id, adminId);
  }
}