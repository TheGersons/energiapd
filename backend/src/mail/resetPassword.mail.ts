import nodemailer, { Transporter } from "nodemailer";

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

class ResetPasswordMail {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "zoho",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async send({ to, subject, html }: SendMailOptions): Promise<void> {
    await this.transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });
  }

  resetPasswordTemplate(fullname: string, temporaryPassword: string): string {
    return `
        <!DOCTYPE html>
        <html lang="es">
        <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Nueva contraseña temporal</title>
        </head>
        <body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 16px;">
            <tr>
            <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

                <tr>
                    <td style="background:#ffffff;border-radius:20px;border:1px solid #e2e8f0;overflow:hidden;">
                    <div style="height:4px;background:linear-gradient(90deg,#10b981,#34d399);"></div>

                    <div style="padding:40px 40px 32px;">
                        <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f172a;letter-spacing:-0.3px;">
                        Nueva contraseña generada
                        </h1>
                        <p style="margin:0 0 24px;font-size:14px;color:#64748b;line-height:1.6;">
                        Hola <strong style="color:#334155;">${fullname}</strong>, hemos generado una contraseña temporal para que puedas acceder a tu cuenta.
                        </p>

                        <div style="background:#f8fafc;border:2px dashed #cbd5e1;border-radius:12px;padding:24px;margin-bottom:24px;text-align:center;">
                        <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:1px;">
                            Tu contraseña temporal
                        </p>
                        <div style="font-family:'Courier New', monospace;font-size:28px;font-weight:700;color:#0f172a;letter-spacing:2px;">
                            ${temporaryPassword}
                        </div>
                        </div>

                        <div style="background:#fff7ed;border:1px solid #ffedd5;border-radius:12px;padding:14px 16px;margin-bottom:28px;display:flex;align-items:flex-start;">
                        <span style="font-size:16px;margin-right:10px;">⚠️</span>
                        <p style="margin:0;font-size:13px;color:#9a3412;line-height:1.5;">
                            Por seguridad, <strong>debes cambiar esta contraseña</strong> inmediatamente después de iniciar sesión.
                        </p>
                        </div>

                        <div style="text-align:center;margin-bottom:28px;">
                        <a href="https://tusitio.com/login"
                            style="display:inline-block;padding:14px 36px;background:#0f172a;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;border-radius:12px;">
                            Ir al Inicio de Sesión
                        </a>
                        </div>

                        <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6;text-align:center;">
                        Si no solicitaste este cambio, por favor contacta al administrador del sistema de inmediato.
                        </p>
                    </div>
                    </td>
                </tr>

                <tr>
                    <td align="center" style="padding-top:20px;">
                    <p style="margin:0;font-size:11px;color:#94a3b8;">
                        © ${new Date().getFullYear()} Panel de Administración · Mensaje de seguridad.
                    </p>
                    </td>
                </tr>

                </table>
            </td>
            </tr>
        </table>
        </body>
        </html>
  `.trim();
  }
}

export const mailService = new ResetPasswordMail();
