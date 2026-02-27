import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

const HTTP_ERROR_MESSAGES: Record<number, string> = {
  0: 'Sin conexión. Verifique su red e intente nuevamente.',
  400: 'La solicitud contiene datos inválidos.',
  401: 'Su sesión ha expirado. Por favor inicie sesión nuevamente.',
  403: 'No tiene permisos para realizar esta acción.',
  404: 'El recurso solicitado no fue encontrado.',
  409: 'Conflicto: el recurso ya existe o está en uso.',
  422: 'Los datos enviados no son válidos.',
  500: 'Error interno del servidor. Contacte al administrador.',
  502: 'Servicio no disponible temporalmente.',
  503: 'El servidor está en mantenimiento. Intente más tarde.',
};

export class ApiError extends Error {
  constructor(
    public readonly userMessage: string,
    public readonly statusCode: number,
    public readonly originalError: HttpErrorResponse,
  ) {
    super(userMessage);
    this.name = 'ApiError';
  }
}

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const isAuthSilent =
    req.url.includes('/auth/refresh') || req.url.includes('/auth/logout');
  const toastr = inject(ToastrService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const backendMessage: string | undefined =
        error.error?.message || error.error?.error || error.error?.detail;

      const userMessage =
        backendMessage ||
        HTTP_ERROR_MESSAGES[error.status] ||
        `Error inesperado (${error.status})`;

      if (error.status !== 401 && !isAuthSilent) {
        toastr.error(userMessage, 'Error');
      }

      return throwError(() => new ApiError(userMessage, error.status, error));
    }),
  );
};
