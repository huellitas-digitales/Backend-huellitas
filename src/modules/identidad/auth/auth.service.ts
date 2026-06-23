import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { MascotasService } from '../mascotas/mascotas.service';
import { LoginDto } from './dto/login.dto';
import { RegistroPublicoDto } from './dto/registro-publico.dto';
import { LogsSistemaService } from '../../core/logs_sistema/logs_sistema.service';
import { MensajeroService } from '../../comunicacion/mensajero/mensajero.service';
import { Usuario } from '../usuarios/entities/usuario.entity';

const ROLES_CON_OTP = ['Administrador', 'Veterinario'];

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly mascotasService: MascotasService,
    private readonly jwtService: JwtService,
    private readonly logsService: LogsSistemaService,
    private readonly mensajero: MensajeroService,
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // 1. Buscar al usuario por correo
    const usuario = await this.usuariosService.findByEmailForAuth(email);
    
    if (!usuario) {
      await this.logsService.registrar({
        accion: 'LOGIN_FALLIDO_USUARIO_INEXISTENTE',
        categoria: 'SEGURIDAD',
        detalles: { email },
      });
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    if (usuario.bloqueado_hasta && usuario.bloqueado_hasta > new Date()) {
      await this.logsService.registrar({
        usuarioId: usuario.id,
        accion: 'LOGIN_BLOQUEADO',
        categoria: 'SEGURIDAD',
        tablaAfectada: 'usuarios',
        registroId: usuario.id,
        detalles: { email, bloqueado_hasta: usuario.bloqueado_hasta },
      });
      throw new UnauthorizedException('Cuenta bloqueada temporalmente por intentos fallidos.');
    }

    if (!usuario.estado_cuenta && usuario.bloqueado_hasta && usuario.bloqueado_hasta <= new Date()) {
      await this.usuariosService.resetearIntentosFallidos(usuario);
    } else if (!usuario.estado_cuenta) {
      throw new UnauthorizedException('Cuenta inactiva.');
    }

    // 2. Comparar la contraseña en texto plano con el Hash de la BD
    const isPasswordValid = await bcrypt.compare(password, usuario.password_hash);
    
    if (!isPasswordValid) {
      await this.usuariosService.registrarLoginFallido(usuario);
      await this.logsService.registrar({
        usuarioId: usuario.id,
        accion: 'LOGIN_FALLIDO_CONTRASENA',
        categoria: 'SEGURIDAD',
        tablaAfectada: 'usuarios',
        registroId: usuario.id,
        detalles: { email, intentos: usuario.intentos_fallidos + 1 },
      });
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 3. JWT directo para todos los roles
    await this.usuariosService.registrarLoginExitoso(usuario);
    await this.logsService.registrar({
      usuarioId: usuario.id,
      accion: 'LOGIN_EXITOSO',
      categoria: 'SEGURIDAD',
      tablaAfectada: 'usuarios',
      registroId: usuario.id,
      detalles: { email, rol: usuario.rol?.nombre },
    });

    const payload = { sub: usuario.id, email: usuario.email, rol: usuario.rol.nombre };
    delete (usuario as any).password_hash;

    return {
      mensaje: '¡Login exitoso!',
      access_token: this.jwtService.sign(payload),
      usuario,
    };
  }

  async verificarOtp(email: string, codigo: string) {
    const usuario = await this.usuarioRepo.findOne({
      where: { email },
      relations: ['rol'],
    });

    if (!usuario) throw new UnauthorizedException('Usuario no encontrado.');

    if (!usuario.otp_codigo || !usuario.otp_expira_en)
      throw new BadRequestException('No hay un código OTP activo para este usuario.');

    if (new Date() > usuario.otp_expira_en)
      throw new UnauthorizedException('El código ha expirado. Inicia sesión nuevamente.');

    if (usuario.otp_codigo !== codigo.trim())
      throw new UnauthorizedException('Código incorrecto.');

    // Limpiar OTP
    await this.usuarioRepo.update(usuario.id, { otp_codigo: null, otp_expira_en: null });
    await this.usuariosService.registrarLoginExitoso(usuario);

    await this.logsService.registrar({
      usuarioId: usuario.id,
      accion: 'LOGIN_EXITOSO',
      categoria: 'SEGURIDAD',
      tablaAfectada: 'usuarios',
      registroId: usuario.id,
      detalles: { email, rol: usuario.rol?.nombre, metodo: '2FA_OTP' },
    });

    const payload = { sub: usuario.id, email: usuario.email, rol: usuario.rol.nombre };
    delete (usuario as any).password_hash;

    return {
      mensaje: '¡Login exitoso!',
      access_token: this.jwtService.sign(payload),
      usuario,
    };
  }

  async verificarPassword(usuarioId: string, password: string): Promise<{ ok: boolean }> {
    const usuario = await this.usuariosService.findByIdForAuth(usuarioId);
    if (!usuario) throw new UnauthorizedException('Usuario no encontrado.');

    const valida = await bcrypt.compare(password, usuario.password_hash);
    if (!valida) throw new UnauthorizedException('Contraseña incorrecta.');

    return { ok: true };
  }

  async registerPublico(dto: RegistroPublicoDto): Promise<{ mensaje: string }> {
    // 1. Crear el usuario Cliente
    const nuevoUsuario = await this.usuariosService.autoRegistroCliente({
      nombres:    dto.nombres,
      apellidos:  dto.apellidos,
      email:      dto.email,
      password:   dto.password,
      telefono:   dto.telefono,
      avatar_url: dto.avatar_url,
    });

    // 2. Crear la mascota con el ID del usuario recién creado
    await this.mascotasService.createMascota(
      {
        nombre:                  dto.mascota.nombre,
        sexo:                    dto.mascota.sexo,
        id_raza_fk:              dto.mascota.id_raza_fk,
        fecha_nacimiento:        dto.mascota.fecha_nacimiento,
        esterilizado:            dto.mascota.esterilizado ?? false,
        foto_url:                dto.mascota.foto_url,
        caracteristicas_fisicas: dto.mascota.caracteristicas_fisicas,
        id_dueno_fk:             nuevoUsuario.id,
      },
      nuevoUsuario.id,
    );

    await this.logsService.registrar({
      usuarioId: nuevoUsuario.id,
      accion:    'REGISTRO_PUBLICO',
      categoria: 'SISTEMA',
      tablaAfectada: 'usuarios',
      registroId: nuevoUsuario.id,
      detalles: { email: nuevoUsuario.email, mascota: dto.mascota.nombre },
    });

    return { mensaje: '¡Registro exitoso! Ya puedes iniciar sesión.' };
  }
}
