import { Injectable } from '@nestjs/common';

@Injectable()
export class ValidadorService {
  private readonly curpRegex = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/;
  private readonly rfcRegex = /^([A-ZÑ&]{3}|[A-ZÑ&]{4})\d{6}[A-Z\d]{3}$/;

  validarCURP(curp: string): boolean {
    if (!curp || typeof curp !== 'string') {
      return false;
    }

    return this.curpRegex.test(curp.toUpperCase());
  }

  validarRFC(rfc: string): boolean {
    if (!rfc || typeof rfc !== 'string') {
      return false;
    }

    return this.rfcRegex.test(rfc.toUpperCase());
  }
}
