import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/huellitas/ should respond with 200', async () => {
    await request(app.getHttpServer())
      .get('/api/huellitas/')
      .expect(200);
  });

  // Agrega aquí más pruebas de integración para los endpoints reales de /api/huellitas/
});
