import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resend } from 'resend';
import Twilio from 'twilio';
import { RegistroNotificacion } from '../registro_notificaciones/entities/registro_notificacione.entity';

@Injectable()
export class MensajeroService {
  private readonly logger = new Logger(MensajeroService.name);

  constructor(
    @InjectRepository(RegistroNotificacion)
    private readonly notifRepo: Repository<RegistroNotificacion>,
  ) {}

  // ── Envía una notificación ya registrada en BD ───────────────────────────────
  async enviar(notificacionId: string): Promise<void> {
    const notif = await this.notifRepo.findOne({ where: { id: notificacionId } });
    if (!notif) {
      this.logger.error(`Notificación ${notificacionId} no encontrada.`);
      return;
    }

    try {
      if (notif.canalEnvio === 'WhatsApp') {
        await this.enviarWhatsApp(notif.cuerpoMensaje);
      } else if (notif.canalEnvio === 'Email') {
        await this.enviarEmail(notif.cuerpoMensaje, notif.tipoNotificacion);
      }
      await this.notifRepo.update(notificacionId, { estadoEnvio: 'Enviado' });
    } catch (err) {
      this.logger.error(`Error enviando notificación ${notificacionId}: ${err.message}`);
      await this.notifRepo.update(notificacionId, { estadoEnvio: 'Error' });
    }
  }

  // ── Envía WhatsApp vía Twilio ─────────────────────────────────────────────────
  async enviarWhatsAppDirecto(telefono: string, mensaje: string): Promise<void> {
    const sid   = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const from  = process.env.TWILIO_WHATSAPP_FROM; // ej: whatsapp:+14155238886

    if (!sid || !token || !from) {
      this.logger.warn('Twilio no configurado: faltan TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN o TWILIO_WHATSAPP_FROM');
      return;
    }

    // Normalizar número al formato whatsapp:+591XXXXXXX
    const numero = telefono.replace(/[\s\-\(\)]/g, '');
    const to = numero.startsWith('whatsapp:') ? numero : `whatsapp:+${numero.replace(/^\+/, '')}`;

    const client = Twilio(sid, token);
    const msg = await client.messages.create({ from, to, body: mensaje });

    this.logger.log(`WhatsApp Twilio enviado a ${to} — SID: ${msg.sid}`);
  }

  // ── Envía Email vía Resend (HTTPS — funciona en Railway) ────────────────────
  async enviarEmailDirecto(destinatario: string, asunto: string, cuerpo: string): Promise<void> {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      this.logger.error('RESEND_API_KEY no configurada — email no enviado');
      return;
    }

    const resend = new Resend(apiKey);
    const from = 'Huellitas Digitales <onboarding@resend.dev>';

    const { error } = await resend.emails.send({
      from,
      to: destinatario,
      subject: asunto,
      html: this.wrapHtml(cuerpo),
    });

    if (error) {
      this.logger.error(`Resend error: ${JSON.stringify(error)}`);
      throw new Error(error.message);
    }

    this.logger.log(`Email enviado a ${destinatario}`);
  }

  // ── Métodos internos — parsean el formato DEST:destino\ncuerpo ───────────────
  private async enviarWhatsApp(mensaje: string): Promise<void> {
    const match = mensaje.match(/^DEST:(\S+)\n([\s\S]+)$/);
    if (!match) throw new Error('Formato WhatsApp incorrecto (falta DEST:numero)');
    await this.enviarWhatsAppDirecto(match[1], match[2].trim());
  }

  private async enviarEmail(mensaje: string, asunto: string): Promise<void> {
    const match = mensaje.match(/^DEST:(\S+)\n([\s\S]+)$/);
    if (!match) throw new Error('Formato Email incorrecto (falta DEST:email)');
    await this.enviarEmailDirecto(match[1], asunto, match[2].trim());
  }

  private wrapHtml(texto: string): string {
    const cuerpo = texto.replace(/\n/g, '<br>');
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <div style="background:#16a34a; padding: 16px; border-radius: 6px 6px 0 0; text-align: center;">
          <h1 style="color:white; margin:0; font-size:20px;">🐾 Huellitas Digitales</h1>
        </div>
        <div style="padding: 24px; color: #374151; line-height: 1.6;">
          ${cuerpo}
        </div>
        <div style="text-align:center; padding: 12px; color: #9ca3af; font-size: 12px;">
          Este mensaje fue generado automáticamente por el sistema Huellitas Digitales.
        </div>
      </div>`;
  }
}
