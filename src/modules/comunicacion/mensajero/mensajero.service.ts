import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
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

  // ── Envía WhatsApp vía Meta Graph API ───────────────────────────────────────
  async enviarWhatsAppDirecto(telefono: string, mensaje: string): Promise<void> {
    const phoneNumberId = process.env.META_PHONE_NUMBER_ID;
    const accessToken   = process.env.META_ACCESS_TOKEN;

    if (!phoneNumberId || !accessToken) {
      this.logger.warn('Meta WhatsApp no configurado: faltan META_PHONE_NUMBER_ID o META_ACCESS_TOKEN');
      return;
    }

    // Normalizar: solo dígitos, sin el prefijo "whatsapp:" ni el "+"
    const to = telefono.replace(/[\s\-\(\)whatsapp:+]/g, '');

    const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;
    const body = {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: mensaje },
    };

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const err = await resp.text();
      throw new Error(`Meta API error ${resp.status}: ${err}`);
    }

    const data = await resp.json() as any;
    this.logger.log(`WhatsApp Meta enviado a ${to} — message_id: ${data?.messages?.[0]?.id}`);
  }

  // ── Envía WhatsApp vía OpenWA (whatsapp-web.js) ─────────────────────────────
  async enviarViaOpenWA(telefono: string, mensaje: string, sessionId = 'default'): Promise<void> {
    const openwaUrl   = process.env.OPENWA_URL;
    const openwaKey   = process.env.OPENWA_API_KEY;

    if (!openwaUrl || !openwaKey) {
      this.logger.warn('OpenWA no configurado: faltan OPENWA_URL o OPENWA_API_KEY');
      return;
    }

    // WhatsApp chatId format: 591XXXXXXXX@c.us
    const numero = telefono.replace(/[\s\-\(\)+]/g, '');
    const chatId = numero.includes('@') ? numero : `${numero}@c.us`;
    const headers = { 'Content-Type': 'application/json', 'X-Api-Key': openwaKey };

    // Resolver la sesión activa real (puede diferir del parámetro hardcodeado)
    let activeSession = sessionId;
    try {
      const listResp = await fetch(`${openwaUrl}/api/sessions`, { headers });
      const listBody = await listResp.text();
      this.logger.log(`OpenWA sessions list: HTTP ${listResp.status} — ${listBody}`);
      if (listResp.ok) {
        const sessions: any[] = JSON.parse(listBody);
        // Buscar la sesión solicitada o la primera WORKING
        const working = sessions.find((s: any) =>
          (s.name === sessionId || s.id === sessionId || s.sessionId === sessionId) &&
          (s.status === 'WORKING' || s.status === 'CONNECTED' || s.status === 'AUTHENTICATED')
        ) ?? sessions.find((s: any) =>
          s.status === 'WORKING' || s.status === 'CONNECTED' || s.status === 'AUTHENTICATED'
        );
        if (working) {
          activeSession = working.name ?? working.id ?? working.sessionId ?? sessionId;
          this.logger.log(`OpenWA usando sesión activa: ${activeSession} (estado: ${working.status})`);
        } else {
          this.logger.warn(`OpenWA: ninguna sesión WORKING encontrada. Sesiones: ${listBody}`);
        }
      }
    } catch (e) {
      this.logger.warn(`OpenWA sessions list failed: ${e.message}`);
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);

    let resp: Response;
    try {
      resp = await fetch(`${openwaUrl}/api/sessions/${activeSession}/messages/send-text`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ chatId, text: mensaje }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }

    if (!resp.ok) {
      const err = await resp.text();
      throw new Error(`OpenWA error ${resp.status}: ${err}`);
    }

    this.logger.log(`WhatsApp OpenWA enviado a ${chatId}`);
  }

  // ── Envía Email vía Nodemailer (Gmail) ───────────────────────────────────────
  async enviarEmailDirecto(destinatario: string, asunto: string, cuerpo: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST ?? 'smtp.gmail.com',
      port: Number(process.env.EMAIL_PORT ?? 587),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM ?? `"Huellitas Digitales" <${process.env.EMAIL_USER}>`,
      to: destinatario,
      subject: asunto,
      html: this.wrapHtml(cuerpo),
    });

    this.logger.log(`Email enviado a ${destinatario}`);
  }

  // ── Métodos internos — parsean el formato DEST:destino\ncuerpo ───────────────
  private async enviarWhatsApp(mensaje: string): Promise<void> {
    const match = mensaje.match(/^DEST:(\S+)\n([\s\S]+)$/);
    if (!match) throw new Error('Formato WhatsApp incorrecto (falta DEST:numero)');
    await this.enviarViaOpenWA(match[1], match[2].trim(), 'huellitas');
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
