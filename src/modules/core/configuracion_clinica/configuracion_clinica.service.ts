import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfiguracionClinica } from './entities/configuracion_clinica.entity';
import { BaseCrudService } from '../../../compartido/utils/base-crud.service';
import { CreateConfiguracionClinicaDto } from './dto/create-configuracion_clinica.dto';

@Injectable()
export class ConfiguracionClinicaService extends BaseCrudService<ConfiguracionClinica> {
  constructor(
    @InjectRepository(ConfiguracionClinica)
    private readonly configRepository: Repository<ConfiguracionClinica>,
  ) {
    super(configRepository, 'Configuración');
  }

  // Fíjate cómo recibimos el UUID del administrador y lo inyectamos al DTO
  async createConfig(createDto: CreateConfiguracionClinicaDto, adminId: string) {
    const dataToSave = {
      ...createDto,
      createdBy: adminId, // ¡Aquí satisfacemos a la base de datos!
    };
    return super.create(dataToSave, { key: 'clave' as keyof ConfiguracionClinica, value: createDto.clave });
  }
}