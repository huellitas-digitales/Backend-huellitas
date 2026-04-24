import { PartialType } from '@nestjs/swagger';
import { CreateHorarioDto } from './create-horarios_atencion.dto';

export class UpdateHorariosAtencionDto extends PartialType(CreateHorarioDto) {}
