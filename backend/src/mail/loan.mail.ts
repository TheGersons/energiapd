export const loanApprovalTemplate = (data: {
  authorizerName: string;
  requesterName: string;
  tools: { name: string; brand: string; serial: string }[];
  requestDate: string;
  returnDate: string;
  approvalUrl: string;
}): string => {
  const toolListHtml = data.tools
    .map(
      (t) => `
        <tr style="border-bottom:1px solid #f1f5f9;">
            <td style="padding:14px 0;">
            <div style="font-size:15px; font-weight:600; color:#1e293b; margin-bottom:2px;">${t.name}</div>
            <div style="font-size:12px; color:#64748b;">
                <span style="color:#94a3b8;">Marca:</span> ${t.brand} · 
                <span style="color:#94a3b8;">S/N:</span> ${t.serial}
            </div>
            </td>
        </tr>`,
    )
    .join("");

  return `
        <!DOCTYPE html>
        <html lang="es">
        <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 16px;">
            <tr>
            <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width:550px;background:#ffffff;border-radius:16px;box-shadow:0 4px 10px rgba(0,0,0,0.03);border:1px solid #e2e8f0;">
                
                <tr>
                    <td style="padding:32px; text-align:center; border-bottom:1px solid #f1f5f9;">
                    <h1 style="margin:0;color:#0f172a;font-size:20px;font-weight:700;">Solicitud de Autorización</h1>
                    <p style="margin:8px 0 0; color:#64748b; font-size:14px;">Módulo de Inventario y Herramientas</p>
                    </td>
                </tr>

                <tr>
                    <td style="padding:32px;">
                    <p style="margin:0 0 20px; font-size:15px; color:#334155;">Hola <strong>${data.authorizerName}</strong>,</p>
                    <p style="margin:0 0 28px; font-size:14px; color:#64748b; line-height:1.5;">
                        <strong>${data.requesterName}</strong> ha solicitado los siguientes equipos para su uso en campo:
                    </p>

                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                        <tr>
                        <td style="padding-bottom:8px; font-size:11px; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:0.5px; border-bottom:2px solid #f1f5f9;">
                            Descripción del Equipo
                        </td>
                        </tr>
                        ${toolListHtml}
                    </table>

                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc; border-radius:12px; margin-bottom:32px;">
                        <tr>
                        <td style="padding:20px;">
                            <table width="100%">
                            <tr>
                                <td>
                                <div style="font-size:11px; color:#94a3b8; text-transform:uppercase; margin-bottom:4px;">Fecha Salida</div>
                                <div style="font-size:14px; color:#1e293b; font-weight:600;">${data.requestDate}</div>
                                </td>
                                <td>
                                <div style="font-size:11px; color:#94a3b8; text-transform:uppercase; margin-bottom:4px;">Retorno Estimado</div>
                                <div style="font-size:14px; color:#1e293b; font-weight:600;">${data.returnDate}</div>
                                </td>
                            </tr>
                            </table>
                        </td>
                        </tr>
                    </table>

                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                        <td align="center">
                            <a href="${data.approvalUrl}" 
                            style="display:inline-block; padding:15px 35px; background:#0f172a; color:#ffffff; font-size:14px; font-weight:700; text-decoration:none; border-radius:10px;">
                            Gestionar Solicitud
                            </a>
                        </td>
                        </tr>
                    </table>
                    </td>
                </tr>

                <tr>
                    <td align="center" style="padding-bottom:32px;">
                    <p style="margin:0; font-size:11px; color:#94a3b8;">
                        © ${new Date().getFullYear()} Sistema de Préstamos · Mensaje automático.
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
};
