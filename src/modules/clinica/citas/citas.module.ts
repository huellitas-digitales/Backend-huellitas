import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitasService } from './citas.service';
import { CitasController } from './citas.controller';
import { Cita } from './entities/cita.entity';
import { HorarioAtencion } from '../horarios_atencion/entities/horarios_atencion.entity';
import { Servicio } from '../../core/servicios/entities/servicio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cita, HorarioAtencion, Servicio])],
  controllers: [CitasController],
  providers: [CitasService],
})
export class CitasModule {}
