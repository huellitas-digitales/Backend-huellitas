import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CierreCaja } from './entities/cierres_caja.entity';
import { CierresCajaService } from './cierres_caja.service';
import { CierresCajaController } from './cierres_caja.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CierreCaja])],
  controllers: [CierresCajaController],
  providers: [CierresCajaService],
})
export class CierresCajaModule {}
