import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RegistroEscaneoQR } from './entities/registro_escaneos_qr.entity';
import { RegistroEscaneoQRService } from './registro_escaneos_qr.service';
import { RegistroEscaneoQRController } from './registro_escaneos_qr.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RegistroEscaneoQR])],
  controllers: [RegistroEscaneoQRController],
  providers: [RegistroEscaneoQRService],
})
export class RegistroEscaneoQRModule {}
