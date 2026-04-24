import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialClinico } from './entities/historial_clinico.entity';
import { HistorialClinicoService } from './historial_clinico.service';
import { HistorialClinicoController } from './historial_clinico.controller';
import { Cita } from '../citas/entities/cita.entity'; // Importamos la entidad Cita

@Module({
  imports: [TypeOrmModule.forFeature([HistorialClinico, Cita])],
  controllers: [HistorialClinicoController],
  providers: [HistorialClinicoService],
})
export class HistorialClinicoModule {}
