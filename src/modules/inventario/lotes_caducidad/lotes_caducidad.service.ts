import { Injectable } from '@nestjs/common';
import { CreateLotesCaducidadDto } from './dto/create-lotes_caducidad.dto';
import { UpdateLotesCaducidadDto } from './dto/update-lotes_caducidad.dto';

@Injectable()
export class LotesCaducidadService {
  create(createLotesCaducidadDto: CreateLotesCaducidadDto) {
    return 'This action adds a new lotesCaducidad';
  }

  findAll() {
    return `This action returns all lotesCaducidad`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lotesCaducidad`;
  }

  update(id: number, updateLotesCaducidadDto: UpdateLotesCaducidadDto) {
    return `This action updates a #${id} lotesCaducidad`;
  }

  remove(id: number) {
    return `This action removes a #${id} lotesCaducidad`;
  }
}
