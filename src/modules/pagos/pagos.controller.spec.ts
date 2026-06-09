import { Body, Controller, HttpCode, INestApplication, Post, ValidationPipe } from '@nestjs/common';
import { IsNumber, IsString } from 'class-validator';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

class ConfirmarPagoDto {
  @IsString()
  transaccionId: string;

  @IsNumber()
  monto: number;

  @IsString()
  estado: string;
}

class TransaccionService {
  async actualizarEstado(transaccionId: string, estado: string, monto: number): Promise<any> {
    return null;
  }
}

@Controller('pagos')
class PagosController {
  constructor(private readonly transaccionService: TransaccionService) {}

  @Post('confirmar')
  @HttpCode(200)
  async confirmar(@Body() payload: ConfirmarPagoDto) {
    return this.transaccionService.actualizarEstado(payload.transaccionId, payload.estado, payload.monto);
  }
}

describe('PagosController (e2e) - Confirmar pago y actualizar transacción', () => {
  let app: INestApplication;
  let transaccionService: TransaccionService;

  const mockTransaccionService = {
    actualizarEstado: jest.fn().mockResolvedValue({ success: true }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [PagosController],
      providers: [
        {
          provide: TransaccionService,
          useValue: mockTransaccionService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    transaccionService = moduleFixture.get<TransaccionService>(TransaccionService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /pagos/confirmar debe devolver 200 y llamar a TransaccionService.actualizarEstado', async () => {
    const payload = {
      transaccionId: 'TX123',
      monto: 500,
      estado: 'COMPLETADO',
    };

    const response = await request(app.getHttpServer())
      .post('/pagos/confirmar')
      .send(payload)
      .expect(200);

    expect(response.body).toEqual({ success: true });
    expect(transaccionService.actualizarEstado).toHaveBeenCalledWith('TX123', 'COMPLETADO', 500);
  });
});
