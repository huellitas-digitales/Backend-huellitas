import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ConfiguracionClinicaService } from './configuracion_clinica.service';
import { CreateConfiguracionClinicaDto } from './dto/create-configuracion_clinica.dto';
// ¡Importamos la seguridad activa!
import { JwtAuthGuard } from '../../identidad/auth/guards/jwt.guard';
import { RolesGuard } from '../../identidad/auth/guards/roles.guard';
import { Roles } from '../../identidad/auth/decorators/roles.decorator';
import { CurrentUser } from '../../identidad/auth/decorators/current-user.decorator';

@Controller('configuracion-clinica')
@UseGuards(JwtAuthGuard, RolesGuard) // <-- GUARDIA ACTIVO
export class ConfiguracionClinicaController {
  constructor(private readonly configService: ConfiguracionClinicaService) {}

  @Post()
  @Roles('Administrador')
  create(
    @Body() createDto: CreateConfiguracionClinicaDto,
    @CurrentUser('id') adminId: string, // <-- Extraemos tu UUID del token mágico
  ) {
    return this.configService.createConfig(createDto, adminId);
  }

  @Get()
  findAll() {
    return this.configService.findAll();
  }
}