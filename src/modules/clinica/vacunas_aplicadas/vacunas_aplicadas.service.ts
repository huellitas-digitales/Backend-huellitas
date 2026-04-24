import { Injectable } from '@nestjs/common';
import { CreateVacunasAplicadaDto } from './dto/create-vacunas_aplicada.dto';
import { UpdateVacunasAplicadaDto } from './dto/update-vacunas_aplicada.dto';

@Injectable()
export class VacunasAplicadasService {
  create(createVacunasAplicadaDto: CreateVacunasAplicadaDto) {
    return 'This action adds a new vacunasAplicada';
  }

  findAll() {
    return `This action returns all vacunasAplicadas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vacunasAplicada`;
  }

  update(id: number, updateVacunasAplicadaDto: UpdateVacunasAplicadaDto) {
    return `This action updates a #${id} vacunasAplicada`;
  }

  remove(id: number) {
    return `This action removes a #${id} vacunasAplicada`;
  }
}
