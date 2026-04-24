import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RegistroEscaneoQR } from './entities/registro_escaneos_qr.entity';

@Injectable()
export class RegistroEscaneoQRService {
  constructor(
    @InjectRepository(RegistroEscaneoQR)
    private readonly escaneoRepository: Repository<RegistroEscaneoQR>,
  ) {}

  // TODO: Implementar métodos
}
