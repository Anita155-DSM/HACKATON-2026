import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const APP_NAME = process.env.APP_NAME || 'Hackathon API';
const FROM = process.env.MAIL_FROM || `${APP_NAME} <no-reply@hackathon.dev>`;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const smtpConfigured = Boolean(process.env.SMTP_HOST);

// Si SMTP_HOST está vacío (que en principio si lo vamos a tener asi), los emails se imprimen en la consola (modo dev)
// en vez de intentar enviarse de verdad.
const transporter = smtpConfigured
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
    })
  : nodemailer.createTransport({ jsonTransport: true });

const layout = (titulo, contenido) => `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>${titulo}</title></head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;padding:32px;">
        <tr><td style="font-size:20px;font-weight:bold;color:#1f2937;padding-bottom:16px;">${APP_NAME}</td></tr>
        <tr><td style="font-size:15px;color:#374151;line-height:1.6;">${contenido}</td></tr>
        <tr><td style="font-size:12px;color:#9ca3af;padding-top:24px;">
          Si no solicitaste esta acción, podés ignorar este email.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

const boton = (href, texto) => `
  <p style="text-align:center;margin:28px 0;">
    <a href="${href}" style="background:#2563eb;color:#ffffff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">${texto}</a>
  </p>
  <p style="font-size:12px;color:#6b7280;">Si el botón no funciona, copiá este link en tu navegador:<br>${href}</p>`;

// Nunca lanza error: un fallo de email no debe romper el flujo principal
const enviarMail = async ({ to, subject, html, text }) => {
  try {
    const info = await transporter.sendMail({ from: FROM, to, subject, html, text });
    if (!smtpConfigured) console.log(`\n📧 [EMAIL DEV] Para: ${to}\n   Asunto: ${subject}\n   ${text}\n`);
    return info;
  } catch (error) {
    console.error(`Error enviando email a ${to}:`, error.message);
    return null;
  }
};

export const enviarMailVerificacion = (destinatario, nombre, tokenPlano, horas) => {
  const link = `${process.env.EMAIL_VERIFY_URL || `${CLIENT_URL}/verify-email`}?token=${tokenPlano}`;
  return enviarMail({
    to: destinatario,
    subject: `Verificá tu email - ${APP_NAME}`,
    html: layout(
      'Verificá tu email',
      `<p>Hola ${nombre},</p>
       <p>Gracias por registrarte. Para activar tu cuenta, verificá tu email:</p>
       ${boton(link, 'Verificar email')}
       <p>El link vence en ${horas} horas.</p>`
    ),
    text: `Hola ${nombre}, verificá tu email ingresando a: ${link} (vence en ${horas} horas)`,
  });
};

export const enviarMailRecuperacion = (destinatario, nombre, tokenPlano, minutos) => {
  const link = `${process.env.RESET_PASSWORD_URL || `${CLIENT_URL}/reset-password`}?token=${tokenPlano}`;
  return enviarMail({
    to: destinatario,
    subject: `Recuperá tu contraseña - ${APP_NAME}`,
    html: layout(
      'Recuperar contraseña',
      `<p>Hola ${nombre},</p>
       <p>Recibimos una solicitud para restablecer tu contraseña.</p>
       ${boton(link, 'Restablecer contraseña')}
       <p>El link vence en ${minutos} minutos.</p>`
    ),
    text: `Hola ${nombre}, restablecé tu contraseña ingresando a: ${link} (vence en ${minutos} minutos)`,
  });
};

export const enviarMailPasswordCambiada = (destinatario, nombre) =>
  enviarMail({
    to: destinatario,
    subject: `Tu contraseña fue modificada - ${APP_NAME}`,
    html: layout(
      'Contraseña modificada',
      `<p>Hola ${nombre},</p>
       <p>Te avisamos que la contraseña de tu cuenta fue modificada y se cerraron todas tus sesiones.</p>
       <p>Si no fuiste vos, recuperá tu cuenta de inmediato.</p>`
    ),
    text: `Hola ${nombre}, la contraseña de tu cuenta fue modificada. Si no fuiste vos, recuperá tu cuenta de inmediato.`,
  });

export const enviarMailBienvenida = (destinatario, nombre) =>
  enviarMail({
    to: destinatario,
    subject: `¡Bienvenido/a a ${APP_NAME}!`,
    html: layout('Bienvenida', `<p>Hola ${nombre},</p><p>Tu email fue verificado y tu cuenta ya está activa. 🎉</p>`),
    text: `Hola ${nombre}, tu email fue verificado y tu cuenta ya está activa.`,
  });

// Verifica la conexión SMTP al arrancar (útil para debug)
export const verificarConexionSMTP = async () => {
  if (!smtpConfigured) return false;
  try {
    await transporter.verify();
    console.log('SMTP listo para enviar emails');
    return true;
  } catch (error) {
    console.error(' No se pudo conectar al SMTP:', error.message);
    return false;
  }
};
