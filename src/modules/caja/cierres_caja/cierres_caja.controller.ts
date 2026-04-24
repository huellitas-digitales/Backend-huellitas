import { Controller } from '@nestjs/common';
import { CierresCajaService } from './cierres_caja.service';

@Controller('cierres-caja')
export class CierresCajaController {
  constructor(private readonly cierreService: CierresCajaService) {}

  // TODO: Implementar endpoints
}
