import { Injectable } from '@nestjs/common';
import { DosisInvalidaException } from './exceptions/dosis-invalida.exception';

export interface CalcularDosisDto {
  peso: number;
  dosisPorKg: number;
}

@Injectable()
export class MedicinaService {
  calcularDosis(data: CalcularDosisDto): number {
    const { peso, dosisPorKg } = data;

    if (peso <= 0) {
      throw new DosisInvalidaException('El peso debe ser mayor que cero.');
    }

    return peso * dosisPorKg;
  }
}
