import { PartialType } from '@nestjs/swagger';
import { CreateVacunasAplicadaDto } from './create-vacunas_aplicada.dto';

export class UpdateVacunasAplicadaDto extends PartialType(CreateVacunasAplicadaDto) {}
