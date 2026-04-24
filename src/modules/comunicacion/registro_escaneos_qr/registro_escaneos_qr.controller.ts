import { Controller } from '@nestjs/common';
import { RegistroEscaneoQRService } from './registro_escaneos_qr.service';

@Controller('registro-escaneos-qr')
export class RegistroEscaneoQRController {
  constructor(private readonly escaneoService: RegistroEscaneoQRService) {}

  // TODO: Implementar endpoints
}
