import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { MedicinaModule } from './medicina.module';

describe('MedicinaController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MedicinaModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /medicina/calcular-dosis debe devolver 201 y dosis 200', async () => {
    await request(app.getHttpServer())
      .post('/medicina/calcular-dosis')
      .send({ peso: 10, dosisPorKg: 20 })
      .expect(201)
      .expect({ dosis: 200 });
  });

  it('POST /medicina/calcular-dosis con peso 0 debe devolver 400', async () => {
    await request(app.getHttpServer())
      .post('/medicina/calcular-dosis')
      .send({ peso: 0, dosisPorKg: 20 })
      .expect(400);
  });
});
