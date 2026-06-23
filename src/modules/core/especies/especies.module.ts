import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EspeciesService } from './especies.service';
import { EspeciesController, PublicoEspeciesController } from './especies.controller';
import { Especie } from './entities/especie.entity';

@Module({
  imports: [

    TypeOrmModule.forFeature([Especie])
  ],
  controllers: [EspeciesController, PublicoEspeciesController],
  providers: [EspeciesService],
  exports: [EspeciesService],
})
export class EspeciesModule {}