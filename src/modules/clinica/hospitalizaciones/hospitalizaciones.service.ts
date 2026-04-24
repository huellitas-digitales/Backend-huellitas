import { Injectable } from '@nestjs/common';
import { CreateHospitalizacioneDto } from './dto/create-hospitalizacione.dto';
import { UpdateHospitalizacioneDto } from './dto/update-hospitalizacione.dto';

@Injectable()
export class HospitalizacionesService {
  create(createHospitalizacioneDto: CreateHospitalizacioneDto) {
    return 'This action adds a new hospitalizacione';
  }

  findAll() {
    return `This action returns all hospitalizaciones`;
  }

  findOne(id: number) {
    return `This action returns a #${id} hospitalizacione`;
  }

  update(id: number, updateHospitalizacioneDto: UpdateHospitalizacioneDto) {
    return `This action updates a #${id} hospitalizacione`;
  }

  remove(id: number) {
    return `This action removes a #${id} hospitalizacione`;
  }
}
