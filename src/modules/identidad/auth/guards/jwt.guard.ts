import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Si el endpoint tiene @Public(), dejar pasar sin token
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    // 🛡️ INTERRUPTOR MAESTRO: ¿Está activado el Modo Dios en el .env?
    if (process.env.MODO_DIOS === 'true' && process.env.NODE_ENV !== 'production') {
      const request = context.switchToHttp().getRequest();
      
      // Inyectamos tu Administrador para que el decorador @CurrentUser funcione
      // y la base de datos guarde el "created_by" sin problemas.
      request.user = { 
        id: 'd4576ec1-15f4-4ca7-8cd5-6a0fb39f321d', // Tu UUID real
        email: 'admin@huellitas.local',
        rol: 'Administrador' 
      };
      
      return true; // Dejamos pasar la petición sin pedir Token
    }

    // Si MODO_DIOS está apagado o no existe, ejecuta la seguridad estricta normal
    return super.canActivate(context);
  }
}
