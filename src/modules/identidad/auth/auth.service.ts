import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginDto } from './dto/login.dto';
import { LogsSistemaService } from '../../core/logs_sistema/logs_sistema.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
    private readonly logsService: LogsSistemaService,
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

    await this.usuariosService.registrarLoginExitoso(usuario);
    await this.logsService.registrar({
      usuarioId: usuario.id,
      accion: 'LOGIN_EXITOSO',
      categoria: 'SEGURIDAD',
      tablaAfectada: 'usuarios',
      registroId: usuario.id,
      detalles: { email, rol: usuario.rol?.nombre },
    });

    // 3. Crear el "Payload" (los datos que irán dentro del pasaporte JWT)
    const payload = { 
      sub: usuario.id, // 'sub' es el estándar para el ID del usuario
      email: usuario.email, 
      rol: usuario.rol.nombre // Ej: 'Administrador'
    };

    // 4. Limpiamos el usuario para devolverlo en la respuesta sin la contraseña
    delete (usuario as any).password_hash;

    // 5. Devolver el Token y los datos del usuario
    return {
      mensaje: '¡Login exitoso!',
      access_token: this.jwtService.sign(payload),
      usuario: usuario,
    };
  }

  async verificarPassword(usuarioId: string, password: string): Promise<{ ok: boolean }> {
    const usuario = await this.usuariosService.findByIdForAuth(usuarioId);
    if (!usuario) throw new UnauthorizedException('Usuario no encontrado.');

    const valida = await bcrypt.compare(password, usuario.password_hash);
    if (!valida) throw new UnauthorizedException('Contraseña incorrecta.');

    return { ok: true };
  }
}
