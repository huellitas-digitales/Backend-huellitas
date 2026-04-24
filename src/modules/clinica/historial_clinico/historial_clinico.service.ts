import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { HistorialClinico } from './entities/historial_clinico.entity';
import { Cita } from '../citas/entities/cita.entity'; // Importamos la entidad Cita
import { CreateHistorialClinicoDto } from './dto/create-historial_clinico.dto';
import { UpdateHistorialClinicoDto } from './dto/update-historial_clinico.dto';
import { HistorialClinicoResponseDto } from './dto/historial-clinico-response.dto';
@Injectable()
export class HistorialClinicoService {
  constructor(
    @InjectRepository(HistorialClinico)
    private readonly historialRepository: Repository<HistorialClinico>,

    @InjectRepository(Cita)
    private readonly citasRepository: Repository<Cita>,
  ) {}

  // En src/modules/clinica/historial_clinico/historial_clinico.service.ts (método create)
async create(createDto: CreateHistorialClinicoDto): Promise<HistorialClinicoResponseDto> {
    // 1. OBTENEMOS LA CITA (Fuente de la verdad)
    const cita = await this.citasRepository.findOne({ 
      where: { id: createDto.id_cita_fk },
      relations: ['mascota', 'veterinario'] 
    });
    
    if (!cita) throw new NotFoundException('La cita vinculada no existe.');
    if (cita.estado !== 'En_Curso') {
      throw new ConflictException(`La mascota debe estar [En_Curso] para generar el historial.`);
    }

    // 2. CREACIÓN Y ASIGNACIÓN
    const nuevoHistorial = new HistorialClinico();
    nuevoHistorial.motivo_consulta = createDto.motivo_consulta;    nuevoHistorial.diagnostico = createDto.diagnostico;
    
    if (createDto.sintomas) nuevoHistorial.sintomas = createDto.sintomas;
    if (createDto.notas_internas) nuevoHistorial.notas_internas = createDto.notas_internas;

    nuevoHistorial.cita = cita;
    nuevoHistorial.veterinario = cita.veterinario;

    // 3. GUARDAMOS EN LA BASE DE DATOS
    const historialGuardado = await this.historialRepository.save(nuevoHistorial);

    // 4. EL MAPEO AL RESPONSE DTO (Aquí ocurre la magia de limpieza)
    const responseLimpio: HistorialClinicoResponseDto = {
      id: historialGuardado.id,
      fecha_consulta: historialGuardado.fecha_consulta,
      motivo_consulta: historialGuardado.motivo_consulta,
      sintomas: historialGuardado.sintomas,
      diagnostico: historialGuardado.diagnostico,
      notas_internas: historialGuardado.notas_internas,

      // Armamos el veterinario bloqueando todo lo que no queremos
      veterinario: {
        id: historialGuardado.veterinario.id,
        nombres: historialGuardado.veterinario.nombres,
        apellidos: historialGuardado.veterinario.apellidos,
        email: historialGuardado.veterinario.email,
      },


      // Armamos la cita
      cita: {
        id: historialGuardado.cita.id,
        estado: historialGuardado.cita.estado,
      },
      peso_actual_kg: 0,
      mascota: {
        id: '',
        nombre: '',
        sexo: ''
      }
    };

    return responseLimpio;
  }
  async update(id: string, updateDto: UpdateHistorialClinicoDto): Promise<HistorialClinico> {
    const historial = await this.historialRepository.findOne({ where: { id } });
    if (!historial) throw new NotFoundException('Historial clínico no encontrado');

    // REGLA DE INMUTABILIDAD
    if (updateDto.diagnostico && updateDto.diagnostico !== historial.diagnostico) {
      throw new BadRequestException('El diagnóstico principal es inmutable.');
    }

    if (updateDto.notas_internas) historial.notas_internas = updateDto.notas_internas;
    return await this.historialRepository.save(historial);
  }

// ... (tus métodos create y update)

  // OBTENER TODOS LOS HISTORIALES
  async findAll(): Promise<HistorialClinico[]> {
    return await this.historialRepository.find({
      // Le decimos a TypeORM que haga los JOINs automáticamente
      relations: ['mascota', 'veterinario', 'cita'], 
      // Ordenamos del más reciente al más antiguo
      order: { fecha_consulta: 'DESC' }, 
    });
  }

  // OBTENER UN HISTORIAL ESPECÍFICO POR ID
  async findOne(id: string): Promise<HistorialClinico> {
    const historial = await this.historialRepository.findOne({
      where: { id },
      relations: ['mascota', 'veterinario', 'cita'],
    });

    if (!historial) {
      throw new NotFoundException(`El historial clínico con ID ${id} no existe.`);
    }

    return historial;
  }

  // SOFT DELETE (Desactivar)
  async desactivar(id: string): Promise<void> {
    // Primero verificamos que exista usando nuestro propio método
    await this.findOne(id); 

    // TypeORM llenará automáticamente la columna 'deleted_at' con la fecha actual.
    // El registro desaparece de los 'find()', pero sigue en tu base de datos (Inmutabilidad).
    await this.historialRepository.softDelete(id); 
  }
}