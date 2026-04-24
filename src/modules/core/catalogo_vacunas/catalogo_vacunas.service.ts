import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CatalogoVacuna } from './entities/catalogo_vacuna.entity';
import { CreateCatalogoVacunaDto } from './dto/create-catalogo_vacuna.dto';
import { BaseCrudService } from '../../../compartido/utils/base-crud.service';
import { EspeciesService } from '../especies/especies.service';

@Injectable()
export class CatalogoVacunasService extends BaseCrudService<CatalogoVacuna> {
  constructor(
    @InjectRepository(CatalogoVacuna)
    private readonly vacunaRepository: Repository<CatalogoVacuna>,
    private readonly especiesService: EspeciesService, // Inyectamos el servicio vecino
  ) {
    super(vacunaRepository, 'Catálogo de Vacuna');
  }

  async createVacuna(createDto: CreateCatalogoVacunaDto) {
    // 1. Validamos que la especie exista antes de guardar la vacuna
    await this.especiesService.findOne(createDto.id_especie_fk);

    // 2. Guardamos usando el método padre
    return super.create(createDto);
  }
}