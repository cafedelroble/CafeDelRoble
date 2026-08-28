import { Resend } from 'resend';

function getBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
    process.env.NEXTAUTH_URL ||
    'http://localhost:3000'
  );
}

export function buildResetUrl(token: string): string {
  const base = getBaseUrl().replace(/\/+$/, '');
  return `${base}/restablecer-password?token=${encodeURIComponent(token)}`;
}

export async function sendPasswordResetEmail(options: { to: string; name: string; token: string }) {
  const resetUrl = buildResetUrl(options.token);
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[mailer] RESEND_API_KEY no configurada; no se envió el correo.');
    return { ok: false, url: resetUrl };
  }
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Café del Roble';
  const from = process.env.RESEND_FROM || `Café del Roble <onboarding@resend.dev>`;
  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: options.to,
      subject: `${options.name ? `${options.name} · ` : ''}Restablece tu contraseña`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #2b2118;">
          <h2 style="color: #6b3a2a;">${appName}</h2>
          <p>Hola${options.name ? ` ${options.name}` : ''},</p>
          <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta. Para continuar, haz clic en el siguiente botón:</p>
          <p style="text-align: center; margin: 28px 0;">
            <a href="${resetUrl}" style="background-color: #6b3a2a; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; display: inline-block;">Restablecer contraseña</a>
          </p>
          <p style="font-size: 13px; color: #7a6a5a;">Si no solicitaste este cambio, puedes ignorar este correo. El enlace expira en 1 hora.</p>
        </div>
      `,
    });
    if (error) {
      console.warn('[mailer] Resend rechazó el envío:', error);
      return { ok: false, url: resetUrl };
    }
    return { ok: true, url: resetUrl };
  } catch (error) {
    console.error('[mailer] Error enviando correo:', error);
    return { ok: false, url: resetUrl };
  }
}