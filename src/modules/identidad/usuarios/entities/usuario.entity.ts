import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../../infraestructura/database/base.entity';
import { Role } from '../../../core/roles/entities/role.entity';
import { Exclude } from 'class-transformer';
@Entity('usuarios')
export class Usuario extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  nombres: string;

  @Column({ type: 'varchar', length: 100 })
  apellidos: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Exclude()
  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  password_hash: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string;

  @Column({ name: 'estado_cuenta', type: 'boolean', default: true })
  estado_cuenta: boolean;

  @Column({ name: 'intentos_fallidos', type: 'integer', default: 0 })
  intentos_fallidos: number;

  @Column({ name: 'bloqueado_hasta', type: 'timestamp', nullable: true })
  bloqueado_hasta: Date;

  @Column({ type: 'int' })
  id_rol_fk: number;

  @Column({ name: 'updated_by', type: 'uuid', nullable: true })
  updated_by: string;

 @ManyToOne(() => Usuario, { nullable: true })
@JoinColumn({ name: 'created_by' })
creador: Usuario;
  // 🔗 LLAVE FORÁNEA: id_rol_fk
  @ManyToOne(() => Role)
  @JoinColumn({ name: 'id_rol_fk' })
  rol: Role;

}