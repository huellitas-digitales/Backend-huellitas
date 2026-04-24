import { Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { Mascota } from './entities/mascota.entity';
import { CreateMascotaDto } from './dto/create-mascota.dto';
import { MascotaResponseDto } from './dto/mascotas-response.dto';
import { BaseCrudService } from '../../../compartido/utils/base-crud.service';

@Injectable()
export class MascotasService extends BaseCrudService<Mascota> {
  constructor(
    @InjectRepository(Mascota)
    private readonly mascotaRepository: Repository<Mascota>,
  ) {
    super(mascotaRepository, 'Mascota');
  }

  async createMascota(createDto: CreateMascotaDto, creatorId: string): Promise<MascotaResponseDto> {
    const hashQr = 'MASC-' + crypto.randomBytes(6).toString('hex').toUpperCase();

    const nuevaMascota = this.mascotaRepository.create({
      ...createDto,
      hash_qr_identidad: hashQr,
      createdBy: creatorId // 👈 Volvemos a usar el formato que funcionó perfecto en usuarios
    });

    const mascotaGuardada = await this.mascotaRepository.save(nuevaMascota);
    
    return MascotaResponseDto.fromEntity(mascotaGuardada);
  }

  async findAllClean(): Promise<MascotaResponseDto[]> {
    const mascotas = await this.mascotaRepository.find();
    // 👈 Usamos fromEntities (en plural) para arreglar el error 7
    return MascotaResponseDto.fromEntities(mascotas); 
  }
}