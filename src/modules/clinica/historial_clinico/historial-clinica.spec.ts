import { Body, Controller, Get, HttpCode, INestApplication, Module, Param, ParseUUIDPipe, Post, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IsNotEmpty, IsString } from 'class-validator';
import request from 'supertest';

class RegistrarConsultaDto {
  @IsString()
  @IsNotEmpty()
  pacienteId: string;

  @IsString()
  @IsNotEmpty()
  anamnesis: string;

  @IsString()
  @IsNotEmpty()
  diagnostico: string;

  @IsString()
  @IsNotEmpty()
  tratamiento: string;
}

class HistoriaClinicaService {
  private historiaPorPaciente: Record<string, { consultas: any[]; ultimaConsulta: any }> = {};

  registrarConsulta(dto: RegistrarConsultaDto) {
    const consulta = {
      id: `CONS-${Date.now()}`,
      pacienteId: dto.pacienteId,
      anamnesis: dto.anamnesis,
      diagnostico: dto.diagnostico,
      tratamiento: dto.tratamiento,
      fecha: new Date().toISOString(),
    };

    const historia = this.historiaPorPaciente[dto.pacienteId] || { consultas: [], ultimaConsulta: null };
    historia.consultas.push(consulta);
    historia.ultimaConsulta = {
      anamnesis: dto.anamnesis,
      diagnostico: dto.diagnostico,
      tratamiento: dto.tratamiento,
      fecha: consulta.fecha,
    };
    this.historiaPorPaciente[dto.pacienteId] = historia;

    return { message: 'Consulta registrada', consulta };
  }

  obtenerHistoria(pacienteId: string) {
    return this.historiaPorPaciente[pacienteId] || { consultas: [], ultimaConsulta: null };
  }
}

@Controller('consultas')
class ConsultasController {
  constructor(private readonly historiaClinicaService: HistoriaClinicaService) {}

  @Post()
  @HttpCode(201)
  registrar(@Body() dto: RegistrarConsultaDto) {
    return this.historiaClinicaService.registrarConsulta(dto);
  }
}

@Controller('pacientes')
class PacientesController {
  constructor(private readonly historiaClinicaService: HistoriaClinicaService) {}

  @Get(':id/historia-clinica')
  obtenerHistoria(@Param('id', ParseUUIDPipe) id: string) {
    return this.historiaClinicaService.obtenerHistoria(id);
  }
}

@Module({
  controllers: [ConsultasController, PacientesController],
  providers: [HistoriaClinicaService],
})
class HistoriaClinicaTestModule {}

describe('Registro de Historia Clínica (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HistoriaClinicaTestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('debe crear una consulta y luego devolverla en el historial del paciente con ultimaConsulta actualizada', async () => {
    const pacienteId = '11111111-1111-1111-1111-111111111111';
    const consultaPayload = {
      pacienteId,
      anamnesis: 'El paciente presenta vómitos intermitentes y letargia.',
      diagnostico: 'Gastroenteritis leve',
      tratamiento: 'Dieta blanda y rehidratación oral',
    };

    const postResponse = await request(app.getHttpServer())
      .post('/api/consultas')
      .send(consultaPayload)
      .expect(201);

    expect(postResponse.body).toHaveProperty('message', 'Consulta registrada');
    expect(postResponse.body).toHaveProperty('consulta');
    expect(postResponse.body.consulta).toMatchObject({
      pacienteId,
      anamnesis: consultaPayload.anamnesis,
      diagnostico: consultaPayload.diagnostico,
      tratamiento: consultaPayload.tratamiento,
    });

    const getResponse = await request(app.getHttpServer())
      .get(`/api/pacientes/${pacienteId}/historia-clinica`)
      .expect(200);

    expect(getResponse.body).toHaveProperty('consultas');
    expect(Array.isArray(getResponse.body.consultas)).toBe(true);
    expect(getResponse.body.consultas).toContainEqual(
      expect.objectContaining({
        pacienteId,
        anamnesis: consultaPayload.anamnesis,
        diagnostico: consultaPayload.diagnostico,
        tratamiento: consultaPayload.tratamiento,
      }),
    );

    expect(getResponse.body).toHaveProperty('ultimaConsulta');
    expect(getResponse.body.ultimaConsulta).toMatchObject({
      anamnesis: consultaPayload.anamnesis,
      diagnostico: consultaPayload.diagnostico,
      tratamiento: consultaPayload.tratamiento,
    });
  });
});
