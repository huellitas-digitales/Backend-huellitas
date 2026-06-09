import { BadRequestException } from '@nestjs/common';

export class DosisInvalidaException extends BadRequestException {
  constructor(message = 'Dosis inválida.') {
    super(message);
  }
}
