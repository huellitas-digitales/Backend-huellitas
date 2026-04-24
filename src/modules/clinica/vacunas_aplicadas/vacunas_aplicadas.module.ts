import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VacunaAplicada } from './entities/vacunas_aplicada.entity';
import { VacunasAplicadasService } from './vacunas_aplicadas.service';
import { VacunasAplicadasController } from './vacunas_aplicadas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([VacunaAplicada])],
  controllers: [VacunasAplicadasController],
  providers: [VacunasAplicadasService],
})
export class VacunasAplicadasModule {}
