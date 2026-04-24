import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseImmutableEntity } from '../../../../infraestructura/database/base-immutable.entity';
import { Producto } from '../../productos/entities/producto.entity'; // 👈 Se conecta al producto

@Entity('lotes_caducidad')
export class LoteCaducidad extends BaseImmutableEntity {
  @Column({ name: 'numero_lote', type: 'varchar', length: 100 })
  numeroLote: string;

  @Column({ name: 'fecha_vencimiento', type: 'date' })
  fechaVencimiento: Date;

  @Column({ name: 'cantidad_inicial', type: 'integer' })
  cantidadInicial: number;

  @Column({ name: 'cantidad_actual', type: 'integer' })
  cantidadActual: number;

  // 🔗 LLAVE FORÁNEA: id_producto_fk
  @ManyToOne(() => Producto)
  @JoinColumn({ name: 'id_producto_fk' })
  producto: Producto;
}