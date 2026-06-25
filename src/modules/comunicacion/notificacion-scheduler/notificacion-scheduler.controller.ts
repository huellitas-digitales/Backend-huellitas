import { Controller, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiBearerAuth } from '@nestjs/swagger';
import { NotificacionSchedulerService } from './notificacion-scheduler.service';
import { JwtAuthGuard } from '../../identidad/auth/guards/jwt.guard';
import { RolesGuard } from '../../identidad/auth/guards/roles.guard';
import { Roles } from '../../identidad/auth/decorators/roles.decorator';

@ApiTags('Scheduler de Notificaciones')
@Controller('notificaciones/scheduler')
export class NotificacionSchedulerController {
  constructor(private readonly scheduler: NotificacionSchedulerService) {}

  @Post('ejecutar-todos')
  @ApiHeader({ name: 'x-bot-key', required: true })
  @ApiOperation({ summary: 'Ejecutar manualmente los 3 cron jobs (bot key)' })
  ejecutarTodos(@Req() req: any) {
    const key = req.headers['x-bot-key'];
    if (!key || key !== process.env.BOT_API_KEY) {
      throw new UnauthorizedException('API Key inválida.');
    }
    return this.scheduler.ejecutarTodosManual();
  }

  @Post('ejecutar-manual')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: dispara recordatorios manualmente desde el panel' })
  ejecutarManual() {
    return this.scheduler.ejecutarTodosManual();
  }
}
