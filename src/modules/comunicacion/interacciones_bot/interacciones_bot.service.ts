import { Injectable } from '@nestjs/common';
import { CreateInteraccionesBotDto } from './dto/create-interacciones_bot.dto';
import { UpdateInteraccionesBotDto } from './dto/update-interacciones_bot.dto';

@Injectable()
export class InteraccionesBotService {
  create(createInteraccionesBotDto: CreateInteraccionesBotDto) {
    return 'This action adds a new interaccionesBot';
  }

  findAll() {
    return `This action returns all interaccionesBot`;
  }

  findOne(id: number) {
    return `This action returns a #${id} interaccionesBot`;
  }

  update(id: number, updateInteraccionesBotDto: UpdateInteraccionesBotDto) {
    return `This action updates a #${id} interaccionesBot`;
  }

  remove(id: number) {
    return `This action removes a #${id} interaccionesBot`;
  }
}
