import { Injectable, ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UsuarioResponseDto } from './dto/usuarios-response.dto';
import { BaseCrudService } from '../../../compartido/utils/base-crud.service';

@Injectable()
export class UsuariosService extends BaseCrudService<Usuario> {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {
    super(usuarioRepository, 'Usuario');
  }

  /**
   * Registro de nuevos usuarios con restricción de jerarquía
   */
  async createUsuario(createDto: CreateUsuarioDto, creatorId: string, creatorRol: string): Promise<UsuarioResponseDto> {
    // 1. Jerarquía: Cajero solo crea Clientes (Rol 4)
    if (creatorRol === 'Cajero' && createDto.id_rol_fk !== 4) {
      throw new ForbiddenException('Los cajeros solo pueden registrar clientes.');
    }

    // 2. Evitar correos duplicados
    const existe = await this.usuarioRepository.findOne({ where: { email: createDto.email } });
    if (existe) throw new ConflictException('El correo ya está en uso.');

    // 3. Encriptación de seguridad
    const password_hash = await bcrypt.hash(createDto.password, 12);

    // 4. Guardado en BD
    const { password, ...datos } = createDto;
    const nuevoUsuario = this.usuarioRepository.create({
      ...datos,
      password_hash,
      creador: { id: creatorId } // Mapeo a la relación de auditoría
    });

    const usuarioGuardado = await this.usuarioRepository.save(nuevoUsuario);
    
    // 5. Devolvemos el DTO limpio
    return UsuarioResponseDto.fromEntity(usuarioGuardado);
  }

  /**
   * Método especial para el AuthModule (Login). 
   * SÍ devuelve la entidad con password_hash porque se necesita para comparar.
   */
  async findByEmailForAuth(email: string): Promise<Usuario | null> {
    return await this.usuarioRepository.createQueryBuilder('usuario')
      .addSelect('usuario.password_hash')
      .leftJoinAndSelect('usuario.rol', 'rol')
      .where('usuario.email = :email', { email })
      .getOne();
  }

  /**
   * Búsqueda por ID con retorno de DTO
   */
  async findOneClean(id: string): Promise<UsuarioResponseDto> {
    const usuario = await this.findOne(id);
    return UsuarioResponseDto.fromEntity(usuario);
  }

  /**
   * Listado general con retorno de DTOs
   */
async findAllClean(): Promise<UsuarioResponseDto[]> {
    const usuarios = await this.usuarioRepository.find();
    // 👇 Aquí está la magia: fromEntities en plural
    return UsuarioResponseDto.fromEntities(usuarios); 
  }
  /**
   * Suspensión lógica de cuenta
   */
  async suspenderCuenta(id: string, adminId: string): Promise<UsuarioResponseDto> {
    const usuario = await this.findOne(id);
    usuario.estado_cuenta = false;
    usuario.updated_by = adminId;
    
    const actualizado = await this.usuarioRepository.save(usuario);
    await this.usuarioRepository.softRemove(actualizado);
    
    return UsuarioResponseDto.fromEntity(actualizado);
  }
}