import { IsUUID, IsString, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateKardexInventarioDto {
  @ApiProperty({ example: 'uuid-producto' })
  @IsUUID('4')
  id_producto_fk: string;

  @ApiProperty({ example: 'uuid-usuario' })
  @IsUUID('4')
  id_usuario_fk: string;

  @ApiProperty({ example: 'Entrada' })
  @IsString()
  tipo_movimiento: string;

  @ApiProperty({ example: 10 })
  @IsInt()
  cantidad: number;

  @ApiProperty({ example: 50 })
  @IsInt()
  saldo_resultante: number;

  @ApiProperty({ example: 'Compra a proveedor', required: false })
  @IsString()
  @IsOptional()
  motivo_detalle?: string;

  @ApiProperty({ example: 'uuid-transaccion', required: false })
  @IsUUID('4')
  @IsOptional()
  id_transaccion_fk?: string;

  @ApiProperty({ example: 'uuid-historial', required: false })
  @IsUUID('4')
  @IsOptional()
  id_historial_fk?: string;
}
