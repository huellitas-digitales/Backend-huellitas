import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../../infraestructura/database/base.entity';
import { HistorialClinico } from '../../historial_clinico/entities/historial_clinico.entity';
import { Mascota } from '../../../identidad/mascotas/entities/mascota.entity';
import { Usuario } from '../../../identidad/usuarios/entities/usuario.entity';

@Entity('hospitalizaciones')
export class Hospitalizacion extends BaseEntity {
  @Column({ name: 'id_historial_fk', type: 'uuid' })
  id_historial_fk: string;

  @Column({ name: 'id_mascota_fk', type: 'uuid' })
  id_mascota_fk: string;

  @Column({ name: 'id_veterinario_responsable', type: 'uuid' })
  id_veterinario_responsable: string;

  @Column({ name: 'fecha_ingreso', type: 'timestamp' })
  fechaIngreso: Date;

  @Column({ name: 'fecha_alta', type: 'timestamp', nullable: true })
  fechaAlta: Date;

  @Column({ name: 'motivo_ingreso', type: 'text' })
  motivoIngreso: string;

  @Column({ name: 'estado_actual', type: 'varchar', length: 50, default: 'Observacion' })
  estadoActual: string;

  @Column({ name: 'costo_por_dia', type: 'numeric', precision: 10, scale: 2, nullable: true })
  costoPorDia: number;

  @Column({ name: 'created_by', type: 'uuid', nullable: false })
  createdBy: string;

  @Column({ name: 'updated_by', type: 'uuid', nullable: true })
  updatedBy: string;

  // 🔗 LLAVES FORÁNEAS
  @ManyToOne(() => HistorialClinico)
  @JoinColumn({ name: 'id_historial_fk' })
  historial: HistorialClinico;

  @ManyToOne(() => Mascota)
  @JoinColumn({ name: 'id_mascota_fk' })
  mascota: Mascota;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_veterinario_responsable' })
  veterinario: Usuario;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'created_by' })
  createdByUser: Usuario;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'updated_by' })
  updatedByUser: Usuario;
}