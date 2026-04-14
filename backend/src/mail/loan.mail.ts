export const loanCreatedTemplate = (data: {
  authorizerName: string;
  requesterName: string;
  loanId: string;
  requestDate: string;
  returnDate: string;
  tools: { name: string; brand: string; serial: string }[];
  actionUrl: string;
}): string => {
  const toolRows = data.tools
    .map(
      (t) => `
      <tr>
        <td style="padding: 12px; border: 1px solid #e2e8f0; font-size: 14px; color: #334155;">${t.name}</td>
        <td style="padding: 12px; border: 1px solid #e2e8f0; font-size: 14px; color: #334155;">${t.brand}</td>
        <td style="padding: 12px; border: 1px solid #e2e8f0; font-size: 14px; color: #334155;">${t.serial}</td>
      </tr>`,
    )
    .join("");

  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="es">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>Nueva Solicitud de Préstamo</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; color: #334155; background-color: #ffffff;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 20px;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 650px; text-align: left;">
          
          <tr>
            <td style="border-bottom: 2px solid #e2e8f0; padding-bottom: 20px;">
              <h1 style="font-size: 22px; color: #0f172a; margin: 0; font-weight: bold;">Gestión de Préstamo de Herramientas</h1>
              <p style="font-size: 14px; color: #64748b; margin: 5px 0 0;">Notificación de creación de ueva solicitud de préstamo de herramientas</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px 0 20px;">
              <p style="font-size: 15px; margin: 0 0 16px;">Estimado(a) <strong>${data.authorizerName}</strong>,</p>
              <p style="font-size: 15px; margin: 0; line-height: 1.6;">
                Se ha registrado una nueva solicitud de préstamo con folio <strong>#${data.loanId.slice(0, 8)}</strong> iniciada por <strong>${data.requesterName}</strong>. 
                La solicitud requiere de su revisión y validación para proceder con la asignación de los equipos.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding-bottom: 30px;">
              <div style="font-size: 11px; font-weight: bold; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">Periodo Solicitado</div>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                <tr>
                  <th width="50%" style="text-align: left; padding: 12px; background-color: #f8fafc; border: 1px solid #e2e8f0; font-size: 13px; color: #475569;">Fecha de Salida</th>
                  <th width="50%" style="text-align: left; padding: 12px; background-color: #f8fafc; border: 1px solid #e2e8f0; font-size: 13px; color: #475569;">Retorno Estimado</th>
                </tr>
                <tr>
                  <td style="padding: 12px; border: 1px solid #e2e8f0; font-size: 14px;">${data.requestDate}</td>
                  <td style="padding: 12px; border: 1px solid #e2e8f0; font-size: 14px;">${data.returnDate}</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding-bottom: 35px;">
              <div style="font-size: 11px; font-weight: bold; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">Equipos en Solicitud</div>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                <thead>
                  <tr>
                    <th style="text-align: left; padding: 12px; background-color: #f1f5f9; border: 1px solid #e2e8f0; font-size: 12px; color: #475569;">Descripción</th>
                    <th style="text-align: left; padding: 12px; background-color: #f1f5f9; border: 1px solid #e2e8f0; font-size: 12px; color: #475569;">Marca</th>
                    <th style="text-align: left; padding: 12px; background-color: #f1f5f9; border: 1px solid #e2e8f0; font-size: 12px; color: #475569;">S/N</th>
                  </tr>
                </thead>
                <tbody>
                  ${toolRows}
                </tbody>
              </table>
            </td>
          </tr>

          <tr>
            <td align="left">
              <a href="${data.actionUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 14px;">
                Revisar Solicitud
              </a>
            </td>
          </tr>

          <tr>
            <td style="padding-top: 20px">
              <div style="border-top: 1px solid #e2e8f0"></div>
            </td>
          </tr>

          <tr>
            <td style="font-size: 12px; color: #94a3b8; padding-top: 20px; margin-top: 40px;">
              Este es un aviso automático de modificación de registros.<br />
              © ${new Date().getFullYear()} Control de Inventario.
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

export const loanConfirmedTemplate = (data: {
  title: string;
  subtitle: string;
  requesterName: string;
  statusText: string;
  statusColor: string;
  loanId: string;
  requestDate: string;
  returnDate: string;
  tools: { name: string; brand: string; serial: string }[];
  actionUrl: string;
}): string => {
  const toolRows = data.tools
    .map(
      (t) => `
      <tr>
        <td style="padding: 12px; border: 1px solid #e2e8f0; font-size: 14px; color: #334155;">${t.name}</td>
        <td style="padding: 12px; border: 1px solid #e2e8f0; font-size: 14px; color: #334155;">${t.brand}</td>
        <td style="padding: 12px; border: 1px solid #e2e8f0; font-size: 14px; color: #334155;">${t.serial}</td>
      </tr>`,
    )
    .join("");

  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="es">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; color: #334155; background-color: #ffffff;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 20px;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 650px; text-align: left;">
          
          <tr>
            <td style="border-bottom: 2px solid #e2e8f0; padding-bottom: 20px;">
              <h1 style="font-size: 22px; color: #0f172a; margin: 0; font-weight: bold;">${data.title}</h1>
              <p style="font-size: 14px; color: #64748b; margin: 5px 0 0;">${data.subtitle}</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px 0 20px;">
              <p style="font-size: 15px; margin: 0 0 16px;">Estimado(a) <strong>${data.requesterName}</strong>,</p>
              <p style="font-size: 15px; margin: 0; line-height: 1.6;">
                Le informamos que la solicitud de préstamo con folio <strong>#${data.loanId.slice(0, 8)}</strong> ha sido procesada y se encuentra en estado: 
                <span style="color: ${data.statusColor}; font-weight: bold;">${data.statusText}</span>.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding-bottom: 30px;">
              <div style="font-size: 12px; font-weight: bold; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">Información del Periodo</div>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                <tr>
                  <th width="50%" style="text-align: left; padding: 12px; background-color: #f8fafc; border: 1px solid #e2e8f0; font-size: 13px; color: #475569;">Fecha de Retiro</th>
                  <th width="50%" style="text-align: left; padding: 12px; background-color: #f8fafc; border: 1px solid #e2e8f0; font-size: 13px; color: #475569;">Fecha de Devolución</th>
                </tr>
                <tr>
                  <td style="padding: 12px; border: 1px solid #e2e8f0; font-size: 14px;">${data.requestDate}</td>
                  <td style="padding: 12px; border: 1px solid #e2e8f0; font-size: 14px;">${data.returnDate}</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding-bottom: 35px;">
              <div style="font-size: 12px; font-weight: bold; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">Equipos Asignados</div>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                <thead>
                  <tr>
                    <th style="text-align: left; padding: 12px; background-color: #f1f5f9; border: 1px solid #e2e8f0; font-size: 13px; color: #475569;">Descripción</th>
                    <th style="text-align: left; padding: 12px; background-color: #f1f5f9; border: 1px solid #e2e8f0; font-size: 13px; color: #475569;">Marca</th>
                    <th style="text-align: left; padding: 12px; background-color: #f1f5f9; border: 1px solid #e2e8f0; font-size: 13px; color: #475569;">S/N</th>
                  </tr>
                </thead>
                <tbody>
                  ${toolRows}
                </tbody>
              </table>
            </td>
          </tr>

          <tr>
            <td align="left">
              <a href="${data.actionUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 14px;">
                Gestionar en la Plataforma
              </a>
            </td>
          </tr>

          <tr>
            <td style="padding-top: 20px">
              <div style="border-top: 1px solid #e2e8f0"></div>
            </td>
          </tr>

          <tr>
            <td style="font-size: 12px; color: #94a3b8; padding-top: 20px; margin-top: 40px;">
              Este es un aviso automático de modificación de registros.<br />
              © ${new Date().getFullYear()} Control de Inventario.
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

export const loanWithQRTemplate = (data: {
  authorizerName: string;
  requesterName: string;
  loanId: string;
  requestDate: string;
  returnDate: string;
  tools: { name: string; brand: string; serial: string }[];
}): string => {
  const toolRows = data.tools
    .map(
      (t) => `
      <tr>
        <td style="padding: 12px; border: 1px solid #e2e8f0; font-size: 14px; color: #334155;">${t.name}</td>
        <td style="padding: 12px; border: 1px solid #e2e8f0; font-size: 14px; color: #334155;">${t.brand}</td>
        <td style="padding: 12px; border: 1px solid #e2e8f0; font-size: 14px; color: #334155;">${t.serial}</td>
      </tr>`,
    )
    .join("");

  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="es">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; color: #334155; background-color: #ffffff;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 20px;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 650px; text-align: left;">
          
          <tr>
            <td style="border-bottom: 2px solid #e2e8f0; padding-bottom: 20px;">
              <h1 style="font-size: 22px; color: #0f172a; margin: 0; font-weight: bold;">Gestión de Préstamo de Herramientas</h1>
              <p style="font-size: 14px; color: #64748b; margin: 5px 0 0;">Notificación de entrega de herramientas</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px 0 20px;">
              <p style="font-size: 15px; margin: 0 0 16px;">Estimado(a) <strong>${data.authorizerName}</strong>,</p>
              <p style="font-size: 15px; margin: 0; line-height: 1.6;">
                Se adjunta el código QR de salida correspondiente a la solicitud de préstamo con folio <strong>#${data.loanId.slice(0, 8)}</strong> a nombre de <strong>${data.requesterName}</strong>. 
                Este código el solicitante podrá salir de las instalaciones.
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding: 20px; border: 1px solid #e2e8f0; border-radius: 4px; background-color: #f8fafc;">
              <img src="cid:loan_qr_code" width="180" height="180" style="display: block; border: 1px solid #cbd5e1;" />
              <p style="font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-top: 15px;">
                Código QR de Consulta - Folio #${data.loanId.slice(0, 8)}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px 0;">
              <div style="font-size: 12px; font-weight: bold; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">Resumen de Equipos</div>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                <thead>
                  <tr>
                    <th style="text-align: left; padding: 12px; background-color: #f1f5f9; border: 1px solid #e2e8f0; font-size: 12px; color: #475569;">Descripción</th>
                    <th style="text-align: left; padding: 12px; background-color: #f1f5f9; border: 1px solid #e2e8f0; font-size: 12px; color: #475569;">Marca</th>
                    <th style="text-align: left; padding: 12px; background-color: #f1f5f9; border: 1px solid #e2e8f0; font-size: 12px; color: #475569;">S/N</th>
                  </tr>
                </thead>
                <tbody>
                  ${toolRows}
                </tbody>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding-top: 20px">
              <div style="border-top: 1px solid #e2e8f0"></div>
            </td>
          </tr>

          <tr>
            <td style="font-size: 12px; color: #94a3b8; padding-top: 20px; margin-top: 40px;">
              Este es un aviso automático de modificación de registros.<br />
              © ${new Date().getFullYear()} Control de Inventario.
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

export const loanReturnTemplate = (data: {
  authorizerName: string;
  requesterName: string;
  loanId: string;
  returnDate: string;
  receivedBy: string;
  tools: { name: string; brand: string; serial: string }[];
  actionUrl: string;
}): string => {
  const toolRows = data.tools
    .map(
      (t) => `
      <tr>
        <td style="padding: 12px; border: 1px solid #e2e8f0; font-size: 14px; color: #334155;">${t.name}</td>
        <td style="padding: 12px; border: 1px solid #e2e8f0; font-size: 14px; color: #334155;">${t.brand}</td>
        <td style="padding: 12px; border: 1px solid #e2e8f0; font-size: 14px; color: #334155;">${t.serial}</td>
      </tr>`,
    )
    .join("");

  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="es">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>Notificación de Retorno de Equipos</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; color: #334155; background-color: #ffffff;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 20px;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 650px; text-align: left;">
          
          <tr>
            <td style="border-bottom: 2px solid #e2e8f0; padding-bottom: 20px;">
              <h1 style="font-size: 22px; color: #0f172a; margin: 0; font-weight: bold;">Gestión de Préstamo de Herramientas</h1>
              <p style="font-size: 14px; color: #64748b; margin: 5px 0 0;">Notificación de cierre de préstamo y retorno de herramientas</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px 0 20px;">
              <p style="font-size: 15px; margin: 0 0 16px;">Estimado(a) <strong>${data.authorizerName}</strong>,</p>
              <p style="font-size: 15px; margin: 0; line-height: 1.6;">
                Se confirma la recepción física y el reingreso al inventario de las herramientas vinculadas al préstamo <strong>#${data.loanId.slice(0, 8)}</strong>, el cual fuera solicitado originalmente por <strong>${data.requesterName}</strong>.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding-bottom: 30px;">
              <div style="font-size: 11px; font-weight: bold; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">Información de Recepción</div>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                <tr>
                  <th width="50%" style="text-align: left; padding: 12px; background-color: #f8fafc; border: 1px solid #e2e8f0; font-size: 12px; color: #475569;">Fecha de Devolución</th>
                  <th width="50%" style="text-align: left; padding: 12px; background-color: #f8fafc; border: 1px solid #e2e8f0; font-size: 12px; color: #475569;">Recibido por</th>
                </tr>
                <tr>
                  <td style="padding: 12px; border: 1px solid #e2e8f0; font-size: 14px;">${data.returnDate}</td>
                  <td style="padding: 12px; border: 1px solid #e2e8f0; font-size: 14px;">${data.receivedBy}</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding-bottom: 35px;">
              <div style="font-size: 11px; font-weight: bold; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">Equipos Reingresados</div>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                <thead>
                  <tr>
                    <th style="text-align: left; padding: 12px; background-color: #f1f5f9; border: 1px solid #e2e8f0; font-size: 12px; color: #475569;">Descripción</th>
                    <th style="text-align: left; padding: 12px; background-color: #f1f5f9; border: 1px solid #e2e8f0; font-size: 12px; color: #475569;">Marca</th>
                    <th style="text-align: left; padding: 12px; background-color: #f1f5f9; border: 1px solid #e2e8f0; font-size: 12px; color: #475569;">S/N</th>
                  </tr>
                </thead>
                <tbody>
                  ${toolRows}
                </tbody>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 15px; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 4px; text-align: center;">
              <span style="color: #166534; font-size: 14px; font-weight: bold;">SOLICITUD FINALIZADA CORRECTAMENTE</span>
            </td>
          </tr>

          <tr>
            <td align="left" style="padding-top: 30px;">
              <a href="${data.actionUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 14px;">
                Consultar Historial
              </a>
            </td>
          </tr>

          <tr>
            <td style="padding-top: 20px">
              <div style="border-top: 1px solid #e2e8f0"></div>
            </td>
          </tr>

          <tr>
            <td style="font-size: 12px; color: #94a3b8; padding-top: 20px; margin-top: 40px;">
              Este es un aviso automático de modificación de registros.<br />
              © ${new Date().getFullYear()} Control de Inventario.
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

export const loanExtensionTemplate = (data: {
  authorizerName: string;
  requesterName: string;
  loanId: string;
  oldReturnDate: string;
  newReturnDate: string;
  reason?: string;
  tools: { name: string; brand: string; serial: string }[];
  actionUrl: string;
}): string => {
  const toolRows = data.tools
    .map(
      (t) => `
      <tr>
        <td style="padding: 12px; border: 1px solid #e2e8f0; font-size: 14px; color: #334155;">${t.name}</td>
        <td style="padding: 12px; border: 1px solid #e2e8f0; font-size: 14px; color: #334155;">${t.brand}</td>
        <td style="padding: 12px; border: 1px solid #e2e8f0; font-size: 14px; color: #334155;">${t.serial}</td>
      </tr>`,
    )
    .join("");

  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="es">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>Notificación de Extensión de Plazo</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; color: #334155; background-color: #ffffff;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 20px;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 650px; text-align: left;">
          
          <tr>
            <td style="border-bottom: 2px solid #e2e8f0; padding-bottom: 20px;">
              <h1 style="font-size: 22px; color: #0f172a; margin: 0; font-weight: bold;">Gestión de Préstamo de Herramientas</h1>
              <p style="font-size: 14px; color: #64748b; margin: 5px 0 0;">Notificación de extensión de retorno de herramientas</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px 0 20px;">
              <p style="font-size: 15px; margin: 0 0 16px;">Estimado equipo de <strong>Almacén</strong>,</p>
              <p style="font-size: 15px; margin: 0; line-height: 1.6;">
                Se ha formalizado una extensión de plazo para la devolución de las herramientas vinculadas al folio <strong>#${data.loanId.slice(0, 8)}</strong> (Solicitante: ${data.requesterName}). 
                Esta gestión ha sido validada y autorizada por <strong>${data.authorizerName}</strong>.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding-bottom: 30px;">
              <div style="font-size: 11px; font-weight: bold; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">Modificación de Calendario</div>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                <tr>
                  <th width="50%" style="text-align: left; padding: 12px; background-color: #f8fafc; border: 1px solid #e2e8f0; font-size: 12px; color: #475569;">Fecha Anterior</th>
                  <th width="50%" style="text-align: left; padding: 12px; background-color: #334155; border: 1px solid #334155; font-size: 12px; color: #ffffff;">Nueva Fecha de Retorno</th>
                </tr>
                <tr>
                  <td style="padding: 12px; border: 1px solid #e2e8f0; font-size: 14px; color: #94a3b8; text-decoration: line-through;">${data.oldReturnDate}</td>
                  <td style="padding: 12px; border: 1px solid #e2e8f0; font-size: 14px; font-weight: bold; color: #0f172a;">${data.newReturnDate}</td>
                </tr>
              </table>
            </td>
          </tr>

          ${
            data.reason
              ? `
          <tr>
            <td style="padding-bottom: 30px;">
              <div style="font-size: 11px; font-weight: bold; color: #94a3b8; text-transform: uppercase; margin-bottom: 10px;">Observaciones / Justificación</div>
              <div style="padding: 12px; background-color: #f8fafc; border: 1px solid #e2e8f0; font-size: 14px; color: #334155; border-radius: 4px;">
                ${data.reason}
              </div>
            </td>
          </tr>
          `
              : ""
          }

          <tr>
            <td style="padding-bottom: 35px;">
              <div style="font-size: 11px; font-weight: bold; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">Equipos en Custodia</div>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                <thead>
                  <tr>
                    <th style="text-align: left; padding: 12px; background-color: #f1f5f9; border: 1px solid #e2e8f0; font-size: 12px; color: #475569;">Descripción</th>
                    <th style="text-align: left; padding: 12px; background-color: #f1f5f9; border: 1px solid #e2e8f0; font-size: 12px; color: #475569;">Marca</th>
                    <th style="text-align: left; padding: 12px; background-color: #f1f5f9; border: 1px solid #e2e8f0; font-size: 12px; color: #475569;">S/N</th>
                  </tr>
                </thead>
                <tbody>
                  ${toolRows}
                </tbody>
              </table>
            </td>
          </tr>

          <tr>
            <td align="left">
              <a href="${data.actionUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 14px;">
                Consultar en la plataforma
              </a>
            </td>
          </tr>

          <tr>
            <td style="padding-top: 20px">
              <div style="border-top: 1px solid #e2e8f0"></div>
            </td>
          </tr>

          <tr>
            <td style="font-size: 12px; color: #94a3b8; padding-top: 20px; margin-top: 40px;">
              Este es un aviso automático de modificación de registros.<br />
              © ${new Date().getFullYear()} Control de Inventario.
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

export const loanOverdueTemplate = (data: {
  authorizerName: string;
  requesterName: string;
  loanId: string;
  expectedReturnDate: string;
  daysOverdue: number;
  tools: { name: string; brand: string; serial: string }[];
  actionUrl: string;
}): string => {
  const toolRows = data.tools
    .map(
      (t) => `
      <tr>
        <td style="padding: 12px; border: 1px solid #e2e8f0; font-size: 14px; color: #334155;">${t.name}</td>
        <td style="padding: 12px; border: 1px solid #e2e8f0; font-size: 14px; color: #334155;">${t.brand}</td>
        <td style="padding: 12px; border: 1px solid #e2e8f0; font-size: 14px; color: #334155;">${t.serial}</td>
      </tr>`,
    )
    .join("");

  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="es">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>Alerta: Préstamo Vencido</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; color: #334155; background-color: #ffffff;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 20px;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 650px; text-align: left;">
          
          <tr>
            <td style="border-bottom: 2px solid #fca5a5; padding-bottom: 20px;">
              <h1 style="font-size: 22px; color: #b91c1c; margin: 0; font-weight: bold;">Gestión de Préstamo de Herramientas</h1>
              <p style="font-size: 14px; color: #64748b; margin: 5px 0 0;">Notificación de incumplimiento de retorno de herramientas</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px 0 20px;">
              <p style="font-size: 15px; margin: 0 0 16px;">Estimado(a) <strong>${data.authorizerName}</strong>,</p>
              <p style="font-size: 15px; margin: 0; line-height: 1.6;">
                Se informa que el préstamo con folio <strong>#${data.loanId.slice(0, 8)}</strong> a cargo de <strong>${data.requesterName}</strong> ha superado la fecha límite de devolución sin haber registrado el reingreso de las herramientas.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding-bottom: 30px;">
              <div style="font-size: 11px; font-weight: bold; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">Estado de la Mora</div>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                <tr>
                  <th width="50%" style="text-align: left; padding: 12px; background-color: #fef2f2; border: 1px solid #fee2e2; font-size: 12px; color: #991b1b;">Fecha Programada</th>
                  <th width="50%" style="text-align: left; padding: 12px; background-color: #b91c1c; border: 1px solid #b91c1c; font-size: 12px; color: #ffffff;">Días de Retraso</th>
                </tr>
                <tr>
                  <td style="padding: 12px; border: 1px solid #e2e8f0; font-size: 14px; color: #334155;">${data.expectedReturnDate}</td>
                  <td style="padding: 12px; border: 1px solid #e2e8f0; font-size: 14px; font-weight: bold; color: #b91c1c;">${data.daysOverdue} día(s)</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding-bottom: 35px;">
              <div style="font-size: 11px; font-weight: bold; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">Activos No Devueltos</div>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                <thead>
                  <tr>
                    <th style="text-align: left; padding: 12px; background-color: #f1f5f9; border: 1px solid #e2e8f0; font-size: 12px; color: #475569;">Descripción</th>
                    <th style="text-align: left; padding: 12px; background-color: #f1f5f9; border: 1px solid #e2e8f0; font-size: 12px; color: #475569;">Marca</th>
                    <th style="text-align: left; padding: 12px; background-color: #f1f5f9; border: 1px solid #e2e8f0; font-size: 12px; color: #475569;">S/N</th>
                  </tr>
                </thead>
                <tbody>
                  ${toolRows}
                </tbody>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px 0 20px;">
              <p style="font-size: 15px; margin: 0 0 16px;">
                Favor gestionar entrega de herramientas o ampliar la fecha de retorno.
              </p>
            </td>
          </tr>

          <tr>
            <td align="left">
              <a href="${data.actionUrl}" style="display: inline-block; padding: 12px 24px; background-color: #b91c1c; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 14px;">
                Consultar en la plataforma
              </a>
            </td>
          </tr>

          <tr>
            <td style="padding-top: 20px">
              <div style="border-top: 1px solid #e2e8f0"></div>
            </td>
          </tr>

          <tr>
            <td style="font-size: 12px; color: #94a3b8; padding-top: 20px; margin-top: 40px;">
              Este es un aviso automático de modificación de registros.<br />
              © ${new Date().getFullYear()} Control de Inventario.
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
