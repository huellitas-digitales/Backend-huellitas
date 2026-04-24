import { Test, TestingModule } from '@nestjs/testing';
import { TransaccionesCajaService } from './transacciones_caja.service';

describe('TransaccionesCajaService', () => {
  let service: TransaccionesCajaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransaccionesCajaService],
    }).compile();

    service = module.get<TransaccionesCajaService>(TransaccionesCajaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
