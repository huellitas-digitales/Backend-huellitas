import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CierreCaja } from './entities/cierres_caja.entity';

@Injectable()
export class CierresCajaService {
  constructor(
    @InjectRepository(CierreCaja)
    private readonly cierreRepository: Repository<CierreCaja>,
  ) {}

  // TODO: Implementar métodos
}
