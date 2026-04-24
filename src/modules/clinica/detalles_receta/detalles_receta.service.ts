import { Injectable } from '@nestjs/common';
import { CreateDetallesRecetaDto } from './dto/create-detalles_receta.dto';
import { UpdateDetallesRecetaDto } from './dto/update-detalles_receta.dto';

@Injectable()
export class DetallesRecetaService {
  create(createDetallesRecetaDto: CreateDetallesRecetaDto) {
    return 'This action adds a new detallesReceta';
  }

  findAll() {
    return `This action returns all detallesReceta`;
  }

  findOne(id: number) {
    return `This action returns a #${id} detallesReceta`;
  }

  update(id: number, updateDetallesRecetaDto: UpdateDetallesRecetaDto) {
    return `This action updates a #${id} detallesReceta`;
  }

  remove(id: number) {
    return `This action removes a #${id} detallesReceta`;
  }
}
