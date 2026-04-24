import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../../infraestructura/database/base.entity';
import { ExpedienteClinico } from '../../expediente_clinico/entities/expediente_clinico.entity';
import { Usuario } from '../../../identidad/usuarios/entities/usuario.entity';
import { Cita } from '../../citas/entities/cita.entity';

@Entity('historial_clinico')
export class HistorialClinico extends BaseEntity {
  @Column({ name: 'id_expediente_fk', type: 'uuid' })
  id_expediente_fk: string;

  @Column({ name: 'id_veterinario_fk', type: 'uuid' })
  id_veterinario_fk: string;

  @Column({ name: 'id_cita_fk', type: 'uuid', nullable: true })
  id_cita_fk: string;

  @Column({ name: 'fecha_consulta', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_consulta: Date;

  @Column({ name: 'tipo_atencion', type: 'varchar', length: 20, default: 'Consulta' })
  tipo_atencion: string;

  @Column({ name: 'motivo_consulta', type: 'varchar', length: 255 })
  motivo_consulta: string;

  @Column({ type: 'text', nullable: true })
  sintomas: string | null; 

  @Column({ name: 'peso_kg', type: 'numeric', precision: 5, scale: 2 })
  peso_kg: number;

  @Column({ name: 'temperatura_c', type: 'numeric', precision: 4, scale: 2 })
  temperatura_c: number;

  @Column({ name: 'frecuencia_cardiaca', type: 'integer' })
  frecuencia_cardiaca: number;

  @Column({ name: 'frecuencia_respiratoria', type: 'integer' })
  frecuencia_respiratoria: number;

  @Column({ name: 'triaje_completado', type: 'boolean', default: false })
  triaje_completado: boolean;

  @Column({ type: 'text' })
  diagnostico: string;

  @Column({ name: 'notas_internas', type: 'text', nullable: true })
  notas_internas: string | null;

  @Column({ name: 'estado', type: 'varchar', length: 20, default: 'Abierto' })
  estado: string;

  @Column({ name: 'created_by', type: 'uuid', nullable: false })
  createdBy: string;

  @Column({ name: 'updated_by', type: 'uuid', nullable: true })
  updatedBy: string;

  // 🔗 LLAVES FORÁNEAS
  @ManyToOne(() => ExpedienteClinico)
  @JoinColumn({ name: 'id_expediente_fk' })
  expediente: ExpedienteClinico;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_veterinario_fk' })
  veterinario: Usuario;

  @ManyToOne(() => Cita)
  @JoinColumn({ name: 'id_cita_fk' })
  cita: Cita;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'created_by' })
  createdByUser: Usuario;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'updated_by' })
  updatedByUser: Usuario;
}