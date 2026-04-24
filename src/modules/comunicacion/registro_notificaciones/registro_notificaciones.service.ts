import { Injectable } from '@nestjs/common';
import { CreateRegistroNotificacioneDto } from './dto/create-registro_notificacione.dto';
import { UpdateRegistroNotificacioneDto } from './dto/update-registro_notificacione.dto';

@Injectable()
export class RegistroNotificacionesService {
  create(createRegistroNotificacioneDto: CreateRegistroNotificacioneDto) {
    return 'This action adds a new registroNotificacione';
  }

  findAll() {
    return `This action returns all registroNotificaciones`;
  }

  findOne(id: number) {
    return `This action returns a #${id} registroNotificacione`;
  }

  update(id: number, updateRegistroNotificacioneDto: UpdateRegistroNotificacioneDto) {
    return `This action updates a #${id} registroNotificacione`;
  }

  remove(id: number) {
    return `This action removes a #${id} registroNotificacione`;
  }
}
