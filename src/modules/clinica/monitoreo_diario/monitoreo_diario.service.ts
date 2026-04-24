import { Injectable } from '@nestjs/common';
import { CreateMonitoreoDiarioDto } from './dto/create-monitoreo_diario.dto';
import { UpdateMonitoreoDiarioDto } from './dto/update-monitoreo_diario.dto';

@Injectable()
export class MonitoreoDiarioService {
  create(createMonitoreoDiarioDto: CreateMonitoreoDiarioDto) {
    return 'This action adds a new monitoreoDiario';
  }

  findAll() {
    return `This action returns all monitoreoDiario`;
  }

  findOne(id: number) {
    return `This action returns a #${id} monitoreoDiario`;
  }

  update(id: number, updateMonitoreoDiarioDto: UpdateMonitoreoDiarioDto) {
    return `This action updates a #${id} monitoreoDiario`;
  }

  remove(id: number) {
    return `This action removes a #${id} monitoreoDiario`;
  }
}
