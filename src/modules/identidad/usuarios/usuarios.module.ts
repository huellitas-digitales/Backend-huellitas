import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosService } from './usuarios.service';
import { UsuariosController, VeterinariosPublicoController } from './usuarios.controller';
import { Usuario } from './entities/usuario.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  controllers: [UsuariosController, VeterinariosPublicoController],
  providers: [UsuariosService],
  exports: [UsuariosService], // Clave para cuando conectemos el Módulo Mascotas
})
export class UsuariosModule {}