import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../../infraestructura/database/base.entity';
import { HistorialClinico } from '../../historial_clinico/entities/historial_clinico.entity';
import { Usuario } from '../../../identidad/usuarios/entities/usuario.entity';

@Entity('archivos_adjuntos')
export class ArchivoAdjunto extends BaseEntity {
  @Column({ name: 'id_historial_fk', type: 'uuid' })
  id_historial_fk: string;

  @Column({ name: 'url_archivo', type: 'varchar', length: 500 })
  urlArchivo: string;

  @Column({ name: 'tipo_archivo', type: 'varchar', length: 50 })
  tipoArchivo: string;

  @Column({ name: 'nombre_archivo', type: 'varchar', length: 200, nullable: true })
  nombreArchivo: string;

  @Column({ name: 'tipo_estudio', type: 'varchar', length: 50, default: 'Otro' })
  tipoEstudio: string;

  @Column({ name: 'origen', type: 'varchar', length: 20, default: 'Interno' })
  origen: string;

  @Column({ name: 'estado_archivo', type: 'varchar', length: 20, default: 'Recibido' })
  estadoArchivo: string;

  @Column({ name: 'fecha_estudio', type: 'date', nullable: true })
  fechaEstudio: Date;

  @Column({ name: 'observaciones', type: 'text', nullable: true })
  observaciones: string;

  @Column({ name: 'created_by', type: 'uuid', nullable: false })
  createdBy: string;

  @Column({ name: 'updated_by', type: 'uuid', nullable: true })
  updatedBy: string;

  // 🔗 LLAVES FORÁNEAS
  @ManyToOne(() => HistorialClinico)
  @JoinColumn({ name: 'id_historial_fk' })
  historialClinico: HistorialClinico;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'created_by' })
  createdByUser: Usuario;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'updated_by' })
  updatedByUser: Usuario;
}