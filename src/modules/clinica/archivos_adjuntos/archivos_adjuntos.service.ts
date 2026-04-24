import { Injectable } from '@nestjs/common';
import { CreateArchivosAdjuntoDto } from './dto/create-archivos_adjunto.dto';
import { UpdateArchivosAdjuntoDto } from './dto/update-archivos_adjunto.dto';

@Injectable()
export class ArchivosAdjuntosService {
  create(createArchivosAdjuntoDto: CreateArchivosAdjuntoDto) {
    return 'This action adds a new archivosAdjunto';
  }

  findAll() {
    return `This action returns all archivosAdjuntos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} archivosAdjunto`;
  }

  update(id: number, updateArchivosAdjuntoDto: UpdateArchivosAdjuntoDto) {
    return `This action updates a #${id} archivosAdjunto`;
  }

  remove(id: number) {
    return `This action removes a #${id} archivosAdjunto`;
  }
}
