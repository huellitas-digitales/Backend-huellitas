import { Injectable } from '@nestjs/common';
import { CreateTransaccionesCajaDto } from './dto/create-transacciones_caja.dto';
import { UpdateTransaccionesCajaDto } from './dto/update-transacciones_caja.dto';

@Injectable()
export class TransaccionesCajaService {
  create(createTransaccionesCajaDto: CreateTransaccionesCajaDto) {
    return 'This action adds a new transaccionesCaja';
  }

  findAll() {
    return `This action returns all transaccionesCaja`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaccionesCaja`;
  }

  update(id: number, updateTransaccionesCajaDto: UpdateTransaccionesCajaDto) {
    return `This action updates a #${id} transaccionesCaja`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaccionesCaja`;
  }
}
