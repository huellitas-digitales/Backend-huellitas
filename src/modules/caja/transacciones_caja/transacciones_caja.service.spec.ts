import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TransaccionesCajaService } from './transacciones_caja.service';
import { TransaccionCaja } from './entities/transacciones_caja.entity';
import { ConfiguracionClinica } from '../../core/configuracion_clinica/entities/configuracion_clinica.entity';

describe('TransaccionesCajaService', () => {
  let service: TransaccionesCajaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransaccionesCajaService,
        {
          provide: getRepositoryToken(TransaccionCaja),
          useValue: { find: jest.fn(), findOne: jest.fn(), save: jest.fn(), manager: { getRepository: jest.fn() } },
        },
        {
          provide: getRepositoryToken(ConfiguracionClinica),
          useValue: {},
        },
        {
          provide: DataSource,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<TransaccionesCajaService>(TransaccionesCajaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
