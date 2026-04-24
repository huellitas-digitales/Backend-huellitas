import { Injectable, BadRequestException, ConflictException,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Cita } from './entities/cita.entity';
import { HorarioAtencion } from '../horarios_atencion/entities/horarios_atencion.entity';
import { Servicio } from '../../core/servicios/entities/servicio.entity'; 

import { CreateCitaDto } from './dto/create-cita.dto';

@Injectable()
export class CitasService {
  constructor(
    @InjectRepository(Cita) private readonly citasRepository: Repository<Cita>,
    @InjectRepository(HorarioAtencion) private readonly horariosRepository: Repository<HorarioAtencion>,
    @InjectRepository(Servicio) private readonly serviciosRepository: Repository<Servicio>,
  ) {}

  async create(createCitaDto: CreateCitaDto): Promise<Cita> {
    const { fecha_hora_inicio, id_veterinario_fk, id_servicio_fk } = createCitaDto;
    
    const servicio = await this.serviciosRepository.findOne({ where: { id: id_servicio_fk } });
    if (!servicio) {
      throw new BadRequestException('El servicio solicitado no existe en el catálogo.');
    }

    const duracionFinal = servicio.duracion_minutos; // El tiempo real 100% garantizado
    const fechaInicio = new Date(fecha_hora_inicio);
    const fechaFin = new Date(fechaInicio.getTime() + duracionFinal * 60000); 

    // --- 2. VALIDACIÓN DE HORARIO LABORAL ---
    let diaSemana = fechaInicio.getDay();
    if (diaSemana === 0) diaSemana = 7; 
    
    const horaStr = `${fechaInicio.getHours().toString().padStart(2, '0')}:${fechaInicio.getMinutes().toString().padStart(2, '0')}:00`;
    const horaFinStr = `${fechaFin.getHours().toString().padStart(2, '0')}:${fechaFin.getMinutes().toString().padStart(2, '0')}:00`;

    const horarioValido = await this.horariosRepository.createQueryBuilder('horario')
      .where('horario.id_veterinario_fk = :vetId', { vetId: id_veterinario_fk })
      .andWhere('horario.dia_semana = :diaSemana', { diaSemana })
      .andWhere('horario.activo = true')
      .andWhere('horario.hora_inicio <= :hora', { hora: horaStr })
      .andWhere('horario.hora_fin >= :horaFinStr', { horaFinStr })
      .getOne();

    if (!horarioValido) {
      throw new BadRequestException('El veterinario no atiende en este horario o la duración excede su turno.');
    }

    // --- 3. DETECCIÓN DE COLISIONES (OVERLAPS) ---
    const colision = await this.citasRepository.createQueryBuilder('cita')
      .where('cita.id_veterinario_fk = :vetId', { vetId: id_veterinario_fk })
      .andWhere('cita.estado NOT IN (:...estados)', { estados: ['Cancelada', 'No_Asistio'] })
      .andWhere(`(
        cita.fecha_hora_inicio < :fechaFin 
        AND 
        (cita.fecha_hora_inicio + (cita.duracion_minutos || ' minutes')::interval) > :fechaInicio
      )`, { fechaInicio, fechaFin })
      .getOne();

    if (colision) {
      throw new ConflictException('El horario seleccionado choca con otra cita existente para este veterinario.');
    }

    // --- 4. PERSISTENCIA ---
    const nuevaCita = this.citasRepository.create({
      ...createCitaDto,
      duracion_minutos: duracionFinal, 
      estado: 'Pendiente', 
    });

    return await this.citasRepository.save(nuevaCita);
  }


  // ... (tu método create anterior)

  async cambiarEstado(id: string, nuevoEstado: string): Promise<Cita> {
    const cita = await this.citasRepository.findOne({ where: { id } });
    
    if (!cita) {
      throw new NotFoundException('La cita solicitada no existe.');
    }

    const estadoActual = cita.estado;

    // REGLA 1: Estados Finales (Inmutables)
    if (['Completada', 'Cancelada', 'No_Asistio'].includes(estadoActual)) {
      throw new BadRequestException(
        `Transacción bloqueada: No se puede cambiar el estado de una cita que ya está en [${estadoActual}].`
      );
    }

    // REGLA 2: Transiciones desde "Pendiente"
    if (estadoActual === 'Pendiente') {
      if (!['En_Curso', 'Cancelada', 'No_Asistio'].includes(nuevoEstado)) {
        throw new BadRequestException(
          `Transición inválida: Una cita [Pendiente] solo puede pasar a [En_Curso], [Cancelada] o [No_Asistio].`
        );
      }
    } 
    
    // REGLA 3: Transiciones desde "En_Curso"
    else if (estadoActual === 'En_Curso') {
      if (nuevoEstado !== 'Completada') {
        throw new BadRequestException(
          `Transición inválida: Una vez que el paciente está [En_Curso], el único estado final posible es [Completada].`
        );
      }
    }

    // Si pasa todas las reglas, aplicamos el cambio
    cita.estado = nuevoEstado;
    return await this.citasRepository.save(cita);
  }
}