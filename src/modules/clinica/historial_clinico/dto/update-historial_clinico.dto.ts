import { PartialType } from '@nestjs/swagger';
import { CreateHistorialClinicoDto } from './create-historial_clinico.dto';

export class UpdateHistorialClinicoDto extends PartialType(CreateHistorialClinicoDto) {}
