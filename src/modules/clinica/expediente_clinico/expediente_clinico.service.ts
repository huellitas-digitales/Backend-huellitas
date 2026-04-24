import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ExpedienteClinico } from './entities/expediente_clinico.entity';

@Injectable()
export class ExpedienteClinicoService {
  constructor(
    @InjectRepository(ExpedienteClinico)
    private readonly expedienteRepository: Repository<ExpedienteClinico>,
  ) {}

  // TODO: Implementar métodos
}
