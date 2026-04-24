import { Injectable } from '@nestjs/common';
import { CreateDetallesTransaccionDto } from './dto/create-detalles_transaccion.dto';
import { UpdateDetallesTransaccionDto } from './dto/update-detalles_transaccion.dto';

@Injectable()
export class DetallesTransaccionService {
  create(createDetallesTransaccionDto: CreateDetallesTransaccionDto) {
    return 'This action adds a new detallesTransaccion';
  }

  findAll() {
    return `This action returns all detallesTransaccion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} detallesTransaccion`;
  }

  update(id: number, updateDetallesTransaccionDto: UpdateDetallesTransaccionDto) {
    return `This action updates a #${id} detallesTransaccion`;
  }

  remove(id: number) {
    return `This action removes a #${id} detallesTransaccion`;
  }
}
