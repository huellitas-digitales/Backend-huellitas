import { PartialType } from '@nestjs/swagger';
import { CreateDetallesRecetaDto } from './create-detalles_receta.dto';

export class UpdateDetallesRecetaDto extends PartialType(CreateDetallesRecetaDto) {}
