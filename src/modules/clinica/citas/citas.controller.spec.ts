import { INestApplication, ValidationPipe, ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';

import { CitasController } from './citas.controller';
import { CitasService } from './citas.service';
import { CitasGateway } from './citas.gateway';
import { NotificacionService } from './notificacion.service';
import { LogsSistemaService } from '../../core/logs_sistema/logs_sistema.service';
import { AgendarCitaDto } from './dto/agendar-cita.dto';
import { JwtAuthGuard } from '../../identidad/auth/guards/jwt.guard';
import { RolesGuard } from '../../identidad/auth/guards/roles.guard';
import { Cita } from './entities/cita.entity';
import { HorarioAtencion } from '../horarios_atencion/entities/horarios_atencion.entity';
import { FechaBloqueada } from '../horarios_atencion/entities/fechas_bloqueadas.entity';
import { Servicio } from '../../core/servicios/entities/servicio.entity';
import { HistorialClinico } from '../historial_clinico/entities/historial_clinico.entity';

describe('CitasController (e2e) - Agendar cita con notificación', () => {
  let app: INestApplication;
  let notificacionService: NotificacionService;

  const mockNotificacionService = {
    enviarNotificacion: jest.fn().mockResolvedValue(undefined),
  };

  beforeAll(async () => {
    const moduleFixtureBuilder = Test.createTestingModule({
      controllers: [CitasController],
      providers: [
        CitasService,
        {
          provide: NotificacionService,
          useValue: mockNotificacionService,
        },
        {
          provide: getRepositoryToken(Cita),
          useValue: {},
        },
        {
          provide: getRepositoryToken(HorarioAtencion),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Servicio),
          useValue: {},
        },
        {
          provide: getRepositoryToken(FechaBloqueada),
          useValue: {},
        },
        {
          provide: getRepositoryToken(HistorialClinico),
          useValue: {},
        },
        {
          provide: CitasGateway,
          useValue: {},
        },
        {
          provide: LogsSistemaService,
          useValue: { registrar: jest.fn().mockResolvedValue(undefined) },
        },
      ],
    });

    const moduleFixture: TestingModule = await moduleFixtureBuilder
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const request = context.switchToHttp().getRequest();
          request.user = { id: 'test-user-id', rol: 'Cliente' };
          return true;
        },
      })
      .overrideGuard(RolesGuard)
      .useValue({
        canActivate: () => true,
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    notificacionService = moduleFixture.get(NotificacionService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /citas/agendar debe devolver 201 y disparar notificación', async () => {
    const payload: AgendarCitaDto = {
      fecha: '2026-06-10',
      mascota: 'Pardo',
      motivo: 'Chequeo general',
    };

    const response = await request(app.getHttpServer())
      .post('/citas/agendar')
      .send(payload)
      .expect(201);

    expect(response.body).toEqual({
      id: 'cita-fake-001',
      fecha: payload.fecha,
      mascota: payload.mascota,
      motivo: payload.motivo,
    });

    expect(notificacionService.enviarNotificacion).toHaveBeenCalledWith({
      title: 'Cita agendada',
      message: `La cita para ${payload.mascota} el ${payload.fecha} ha sido registrada. Motivo: ${payload.motivo}`,
      destinatarioId: 'test-user-id',
    });
  });
});
