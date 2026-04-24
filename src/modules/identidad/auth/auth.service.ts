import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // 1. Buscar al usuario por correo
    const usuario = await this.usuariosService.findByEmailForAuth(email);
    
    if (!usuario) {
      throw new UnauthorizedException('Credenciales incorrectas (correo no encontrado)');
    }

    // 2. Comparar la contraseña en texto plano con el Hash de la BD
    const isPasswordValid = await bcrypt.compare(password, usuario.password_hash);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales incorrectas (contraseña inválida)');
    }

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
}