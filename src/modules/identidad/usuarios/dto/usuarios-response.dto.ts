import { Usuario } from '../entities/usuario.entity';

export class UsuarioResponseDto {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  id_rol_fk: number;
  estado_cuenta: boolean;
  created_at: Date;
  updated_at: Date;
  created_by: string;

  // 👇 Aquí está el método real, ¡asegúrate de que no tenga el throw new Error!
  static fromEntity(entity: Usuario): UsuarioResponseDto {
    const dto = new UsuarioResponseDto();
    dto.id = entity.id;
    dto.nombres = entity.nombres;
    dto.apellidos = entity.apellidos;
    dto.email = entity.email;
    dto.telefono = entity.telefono;
    dto.id_rol_fk = entity.id_rol_fk;
    dto.estado_cuenta = entity.estado_cuenta;
    dto.created_at = entity.createdAt;
    dto.updated_at = entity.updatedAt;
    dto.created_by = entity.creador?.id;
    return dto;
  }

  static fromEntities(entities: Usuario[]): UsuarioResponseDto[] {
    return entities.map(entity => this.fromEntity(entity));
  }
}