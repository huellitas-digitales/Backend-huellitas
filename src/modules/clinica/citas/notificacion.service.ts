import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificacionService {
  async enviarNotificacion(payload: { title: string; message: string; destinatarioId: string }): Promise<void> {
    // Implementación mínima para el flujo de notificación.
    // En pruebas se mockeará este servicio.
    return Promise.resolve();
  }
}
