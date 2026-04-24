import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../../infraestructura/database/base.entity';
import { HistorialClinico } from '../../historial_clinico/entities/historial_clinico.entity';
import { CatalogoVacuna } from '../../../core/catalogo_vacunas/entities/catalogo_vacuna.entity';
import { Usuario } from '../../../identidad/usuarios/entities/usuario.entity';

@Entity('vacunas_aplicadas')
export class VacunaAplicada extends BaseEntity {
  @Column({ name: 'id_historial_fk', type: 'uuid' })
  id_historial_fk: string;

  @Column({ name: 'id_vacuna_fk', type: 'integer' })
  id_vacuna_fk: number;

  @Column({ name: 'id_veterinario_fk', type: 'uuid', nullable: true })
  id_veterinario_fk: string;

  @Column({ name: 'fecha_aplicacion', type: 'date' })
  fechaAplicacion: Date;

  @Column({ name: 'fecha_proxima_dosis', type: 'date', nullable: true })
  fechaProximaDosis: Date;

  @Column({ name: 'peso_mascota_kg', type: 'numeric', precision: 5, scale: 2, nullable: true })
  pesoMascotaKg: number;

  @Column({ name: 'lote_vacuna', type: 'varchar', length: 100, nullable: true })
  loteVacuna: string;

  @Column({ name: 'created_by', type: 'uuid', nullable: false })
  createdBy: string;

  @Column({ name: 'updated_by', type: 'uuid', nullable: true })
  updatedBy: string;

  // 🔗 LLAVES FORÁNEAS
  @ManyToOne(() => HistorialClinico)
  @JoinColumn({ name: 'id_historial_fk' })
  historial: HistorialClinico;

  @ManyToOne(() => CatalogoVacuna)
  @JoinColumn({ name: 'id_vacuna_fk' })
  vacuna: CatalogoVacuna;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_veterinario_fk' })
  veterinario: Usuario;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'created_by' })
  createdByUser: Usuario;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'updated_by' })
  updatedByUser: Usuario;
}