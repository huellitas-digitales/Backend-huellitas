import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto'; // Asumo que lo creas con PartialType

@Controller('roles')
// TODO: DESCOMENTAR AL FINAL
// @UseGuards(JwtAuthGuard, RolesGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  // @Roles('Administrador')
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.createRole(createRoleDto);
  }

  @Get()
  findAll() { return this.rolesService.findAll(); }

  // ... (findOne, update, remove iguales a los demás) ...
}