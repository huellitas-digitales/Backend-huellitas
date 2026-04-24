import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // 🛡️ INTERRUPTOR MAESTRO: ¿Está activado el Modo Dios en el .env?
    if (process.env.MODO_DIOS === 'true') {
      const request = context.switchToHttp().getRequest();
      
      // Inyectamos tu Administrador para que el decorador @CurrentUser funcione
      // y la base de datos guarde el "created_by" sin problemas.
      request.user = { 
        id: '1e4620cb-38a1-4df3-8a35-f5d556698c47', // Tu UUID real
        email: 'admin@huellitas.local',
        rol: 'Administrador' 
      };
      
      return true; // Dejamos pasar la petición sin pedir Token
    }

    // Si MODO_DIOS está apagado o no existe, ejecuta la seguridad estricta normal
    return super.canActivate(context);
  }
}