import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../../infraestructura/database/base.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Raza } from '../../../core/razas/entities/raza.entity';

@Entity('mascotas')
export class Mascota extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ name: 'fecha_nacimiento', type: 'date', nullable: true })
  fecha_nacimiento: Date;

  @Column({ type: 'char', length: 1 })
  sexo: string;

  @Column({ type: 'boolean', default: false })
  esterilizado: boolean;

@Column({ name: 'hash_qr_identidad', type: 'varchar', length: 50, unique: true, nullable: true })
  hash_qr_identidad: string;

  @Column({ type: 'uuid', nullable: true })
  id_dueno_fk: string;

  @Column({ type: 'int', nullable: true })
  id_raza_fk: number;

  @Column({ name: 'estado_perdido', type: 'boolean', default: false })
  estado_perdido: boolean;

  @Column({ name: 'url_perfil_publico', type: 'varchar', length: 500, nullable: true })
  url_perfil_publico: string;

  @Column({ name: 'created_by', type: 'uuid', nullable: false })
  createdBy: string;

  @Column({ name: 'updated_by', type: 'uuid', nullable: true })
  updatedBy: string;

  // 🔗 LLAVE FORÁNEA: id_dueno_fk
  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_dueno_fk' })
  dueno: Usuario;

  // 🔗 LLAVE FORÁNEA: id_raza_fk
  @ManyToOne(() => Raza)
  @JoinColumn({ name: 'id_raza_fk' })
  raza: Raza;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'created_by' })
  createdByUser: Usuario;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'updated_by' })
  updatedByUser: Usuario;
}