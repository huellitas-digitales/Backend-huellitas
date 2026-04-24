import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../../infraestructura/database/base.entity';
import { Receta } from '../../recetas/entities/receta.entity';
import { Producto } from '../../../inventario/productos/entities/producto.entity';
import { Usuario } from '../../../identidad/usuarios/entities/usuario.entity';

@Entity('detalles_receta')
export class DetalleReceta extends BaseEntity {
  @Column({ name: 'id_receta_fk', type: 'uuid' })
  id_receta_fk: string;

  @Column({ name: 'id_producto_fk', type: 'uuid' })
  id_producto_fk: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  dosis: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  frecuencia: string;

  @Column({ name: 'duracion_dias', type: 'integer', nullable: true })
  duracionDias: number;

  @Column({ name: 'medicamento_texto', type: 'varchar', length: 150, nullable: true })
  medicamentoTexto: string;

  @Column({ name: 'created_by', type: 'uuid', nullable: false })
  createdBy: string;

  @Column({ name: 'updated_by', type: 'uuid', nullable: true })
  updatedBy: string;

  // 🔗 LLAVES FORÁNEAS
  @ManyToOne(() => Receta)
  @JoinColumn({ name: 'id_receta_fk' })
  receta: Receta;

  @ManyToOne(() => Producto)
  @JoinColumn({ name: 'id_producto_fk' })
  producto: Producto;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'created_by' })
  createdByUser: Usuario;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'updated_by' })
  updatedByUser: Usuario;
}