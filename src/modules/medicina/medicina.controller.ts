import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CalcularDosisDto, MedicinaService } from './medicina.service';

@Controller('medicina')
export class MedicinaController {
  constructor(private readonly medicinaService: MedicinaService) {}

  @Post('calcular-dosis')
  @HttpCode(HttpStatus.CREATED)
  calcularDosis(@Body() data: CalcularDosisDto) {
    const dosis = this.medicinaService.calcularDosis(data);
    return { dosis };
  }
}
