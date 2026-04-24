import { Mascota } from '../entities/mascota.entity';

export class MascotaResponseDto {
  id: string;
  nombre: string;
  sexo: string;
  fecha_nacimiento: Date;
  esterilizado: boolean;
  estado_perdido: boolean;
  hash_qr_identidad: string;
  id_dueno_fk: string;
  id_raza_fk: number;

  static fromEntity(entity: Mascota): MascotaResponseDto {
    const dto = new MascotaResponseDto();
    dto.id = entity.id;
    dto.nombre = entity.nombre;
    dto.sexo = entity.sexo;
    dto.fecha_nacimiento = entity.fecha_nacimiento;
    dto.esterilizado = entity.esterilizado;
    dto.estado_perdido = entity.estado_perdido;
    dto.hash_qr_identidad = entity.hash_qr_identidad;
    dto.id_dueno_fk = entity.id_dueno_fk;
    dto.id_raza_fk = entity.id_raza_fk;
    return dto;
  }

  static fromEntities(entities: Mascota[]): MascotaResponseDto[] {
    return entities.map(entity => this.fromEntity(entity));
  }
}