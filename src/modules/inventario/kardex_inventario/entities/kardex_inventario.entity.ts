import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseImmutableEntity } from '../../../../infraestructura/database/base-immutable.entity';
import { Usuario } from '../../../identidad/usuarios/entities/usuario.entity';
import { Producto } from '../../productos/entities/producto.entity';

// 🔴 Imports temporales en rojo (se arreglarán en los próximos pasos)
import { TransaccionCaja } from '../../../caja/transacciones_caja/entities/transacciones_caja.entity';
import { HistorialClinico } from '../../../clinica/historial_clinico/entities/historial_clinico.entity';

@Entity('kardex_inventario')
export class KardexInventario extends BaseImmutableEntity {
  @Column({ name: 'tipo_movimiento', type: 'varchar', length: 20 })
  tipoMovimiento: string; // 'Entrada', 'Salida_Venta', etc.

  @Column({ type: 'integer' })
  cantidad: number;

  @Column({ name: 'saldo_resultante', type: 'integer' })
  saldoResultante: number;

  @Column({ name: 'motivo_detalle', type: 'varchar', length: 255, nullable: true })
  motivoDetalle: string;

  // 🔗 LLAVES FORÁNEAS
  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario_fk' })
  usuario: Usuario;

  @ManyToOne(() => Producto)
  @JoinColumn({ name: 'id_producto_fk' })
  producto: Producto;

  @ManyToOne(() => TransaccionCaja)
  @JoinColumn({ name: 'id_transaccion_fk' })
  transaccion: TransaccionCaja;

  @ManyToOne(() => HistorialClinico)
  @JoinColumn({ name: 'id_historial_fk' })
  historial: HistorialClinico;
}