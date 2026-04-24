import { PartialType } from '@nestjs/swagger';
import { CreateArchivosAdjuntoDto } from './create-archivos_adjunto.dto';

export class UpdateArchivosAdjuntoDto extends PartialType(CreateArchivosAdjuntoDto) {}
