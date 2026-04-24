import { Test, TestingModule } from '@nestjs/testing';
import { TransaccionesCajaController } from './transacciones_caja.controller';
import { TransaccionesCajaService } from './transacciones_caja.service';

describe('TransaccionesCajaController', () => {
  let controller: TransaccionesCajaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransaccionesCajaController],
      providers: [TransaccionesCajaService],
    }).compile();

    controller = module.get<TransaccionesCajaController>(TransaccionesCajaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
