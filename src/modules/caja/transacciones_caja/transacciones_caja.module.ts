import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransaccionCaja } from './entities/transacciones_caja.entity';
import { TransaccionesCajaService } from './transacciones_caja.service';
import { TransaccionesCajaController } from './transacciones_caja.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TransaccionCaja])],

  controllers: [TransaccionesCajaController],
  providers: [TransaccionesCajaService],
})
export class TransaccionesCajaModule {}
