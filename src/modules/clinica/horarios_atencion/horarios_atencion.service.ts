import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {UpdateHorariosAtencionDto} from './dto/update-horarios_atencion.dto';
import { HorarioAtencion } from './entities/horarios_atencion.entity';
import { CreateHorarioDto } from './dto/create-horarios_atencion.dto';
import { Cita } from '../citas/entities/cita.entity';

@Injectable()
export class HorariosAtencionService {
  constructor(
    @InjectRepository(HorarioAtencion)
    private readonly horariosRepository: Repository<HorarioAtencion>,

    @InjectRepository(Cita) // Inyectamos el repositorio de Citas para validar conflictos
    private readonly citasRepository: Repository<Cita>,
  ) {}

  async create(createHorarioDto: CreateHorarioDto): Promise<HorarioAtencion> {
    const { dia_semana, hora_inicio, hora_fin, id_veterinario_fk } = createHorarioDto;

   
    if (hora_inicio >= hora_fin) {
      throw new BadRequestException('Incoherencia temporal: La hora de inicio debe ser anterior a la hora de fin.');
    }

    // Regla 2: Evitar solapamientos (Overlaps) del mismo médico en el mismo día
    // Fórmula: (NuevoInicio < FinExistente) AND (NuevoFin > InicioExistente)
    const overlap = await this.horariosRepository.createQueryBuilder('horario')
      .where('horario.id_veterinario_fk = :vetId', { vetId: id_veterinario_fk })
      .andWhere('horario.dia_semana = :diaSemana', { diaSemana: dia_semana })
      .andWhere('horario.activo = true')
      .andWhere('(horario.hora_inicio < :fin AND horario.hora_fin > :inicio)', { 
        inicio: hora_inicio, 
        fin: hora_fin 
      })
      .getOne();

    if (overlap) {
      throw new ConflictException('El veterinario ya tiene un bloque de turno activo que choca con este nuevo horario en el mismo día.');
    }

    // Si todo está correcto, lo creamos
    const nuevoHorario = this.horariosRepository.create(createHorarioDto);
    return await this.horariosRepository.save(nuevoHorario);
  }

  // Método extra muy útil para que el Frontend dibuje la agenda
  async findAllByVeterinario(idVeterinario: string): Promise<HorarioAtencion[]> {
    return await this.horariosRepository.find({
      where: { 
        id_veterinario_fk: idVeterinario,
        activo: true 
      },
      order: {
        dia_semana: 'ASC',
        hora_inicio: 'ASC',
      }
    });
  }


  async update(id: string, updateHorarioDto: UpdateHorariosAtencionDto): Promise<HorarioAtencion> {
    const horario = await this.horariosRepository.findOne({ where: { id } });
    if (!horario) throw new NotFoundException('Horario no encontrado');

    // REGLA DE NEGOCIO: ¿Podemos cambiar este horario?
    // Buscamos si hay citas Pendientes o En Curso que choquen con el horario "viejo" 
    // y que estén en el futuro. (Lógica simplificada para el ejemplo)
    const citasPendientes = await this.citasRepository.createQueryBuilder('cita')
      .where('cita.id_veterinario_fk = :vetId', { vetId: horario.id_veterinario_fk })
      .andWhere('cita.estado IN (:...estados)', { estados: ['Pendiente', 'En_Curso'] })
      // Aquí iría la lógica para comparar si el día de la semana coincide con las citas futuras
      .getCount();

    if (citasPendientes > 0) {
      throw new BadRequestException('No puedes modificar este horario porque el veterinario tiene citas pendientes. Reasigna las citas primero.');
    }

    // Si no hay peligro, actualizamos
    Object.assign(horario, updateHorarioDto);
    return await this.horariosRepository.save(horario);
  }

  async desactivar(id: string): Promise<void> {
    const horario = await this.horariosRepository.findOne({ where: { id } });
    if (!horario) throw new NotFoundException('Horario no encontrado');

    // Mismo chequeo de seguridad que el Update
    const citasPendientes = await this.citasRepository.count({
      where: { 
        id_veterinario_fk: horario.id_veterinario_fk,
        // Faltaría filtrar por citas que caigan exactamente en este día de la semana
      }
    });

    if (citasPendientes > 0) {
      throw new BadRequestException('No puedes desactivar este turno porque hay pacientes agendados.');
    }

    // Cumpliendo tu requerimiento de inmutabilidad (Soft Delete / Inactivación)
    horario.activo = false;
    await this.horariosRepository.save(horario);
    
    // Alternativa si configuras SoftDelete en TypeORM:
    // await this.horariosRepository.softDelete(id); 
  }
}