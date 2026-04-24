import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KardexInventario } from './entities/kardex_inventario.entity';
import { KardexInventarioService } from './kardex_inventario.service';
import { KardexInventarioController } from './kardex_inventario.controller';

@Module({
  imports: [TypeOrmModule.forFeature([KardexInventario])],
  controllers: [KardexInventarioController],
  providers: [KardexInventarioService],
})
export class KardexInventarioModule {}
