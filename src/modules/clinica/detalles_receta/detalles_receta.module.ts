import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleReceta } from './entities/detalles_receta.entity';
import { DetallesRecetaService } from './detalles_receta.service';
import { DetallesRecetaController } from './detalles_receta.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DetalleReceta])],
  controllers: [DetallesRecetaController],
  providers: [DetallesRecetaService],
})
export class DetallesRecetaModule {}
