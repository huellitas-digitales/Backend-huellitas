import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt.guard';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión y obtener Token JWT' })
  @ApiResponse({ status: 200, description: 'Login exitoso, devuelve el Token.' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('verificar-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verificar contraseña del usuario autenticado (para confirmar acciones sensibles)' })
  @ApiResponse({ status: 200, description: 'Contraseña correcta.' })
  @ApiResponse({ status: 401, description: 'Contraseña incorrecta.' })
  verificarPassword(
    @Req() req: any,
    @Body() body: { password: string },
  ) {
    return this.authService.verificarPassword(req.user.id, body.password);
  }
}