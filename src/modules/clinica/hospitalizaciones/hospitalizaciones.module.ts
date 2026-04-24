import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hospitalizacion } from './entities/hospitalizacione.entity';
import { HospitalizacionesService } from './hospitalizaciones.service';
import { HospitalizacionesController } from './hospitalizaciones.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Hospitalizacion])],
  controllers: [HospitalizacionesController],
  providers: [HospitalizacionesService],
})
export class HospitalizacionesModule {}
