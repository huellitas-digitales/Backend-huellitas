import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistroNotificacion } from './entities/registro_notificacione.entity';
import { RegistroNotificacionesService } from './registro_notificaciones.service';
import { RegistroNotificacionesController } from './registro_notificaciones.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RegistroNotificacion])],
  controllers: [RegistroNotificacionesController],
  providers: [RegistroNotificacionesService],
})
export class RegistroNotificacionesModule {}
