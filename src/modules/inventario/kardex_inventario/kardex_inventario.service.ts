import { Injectable } from '@nestjs/common';
import { CreateKardexInventarioDto } from './dto/create-kardex_inventario.dto';
import { UpdateKardexInventarioDto } from './dto/update-kardex_inventario.dto';

@Injectable()
export class KardexInventarioService {
  create(createKardexInventarioDto: CreateKardexInventarioDto) {
    return 'This action adds a new kardexInventario';
  }

  findAll() {
    return `This action returns all kardexInventario`;
  }

  findOne(id: number) {
    return `This action returns a #${id} kardexInventario`;
  }

  update(id: number, updateKardexInventarioDto: UpdateKardexInventarioDto) {
    return `This action updates a #${id} kardexInventario`;
  }

  remove(id: number) {
    return `This action removes a #${id} kardexInventario`;
  }
}
