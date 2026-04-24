import { PartialType } from '@nestjs/swagger';
import { CreateMonitoreoDiarioDto } from './create-monitoreo_diario.dto';

export class UpdateMonitoreoDiarioDto extends PartialType(CreateMonitoreoDiarioDto) {}
