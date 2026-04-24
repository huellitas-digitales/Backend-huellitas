import { Controller } from '@nestjs/common';
import { ExpedienteClinicoService } from './expediente_clinico.service';

@Controller('expediente-clinico')
export class ExpedienteClinicoController {
  constructor(private readonly expedienteService: ExpedienteClinicoService) {}

  // TODO: Implementar endpoints
}
