import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceService } from '@base/service/auth-device.service';
import { LogoutUseCase } from '@domain/auth/usecase/logout.usecase';
import { RefreshTokenUseCase } from '@domain/auth/usecase/refreshToken.usecase';
import {
  BehaviorSubject,
  catchError,
  filter,
  switchMap,
  take,
  throwError,
} from 'rxjs';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(RefreshTokenUseCase);
  const logOut = inject(LogoutUseCase);
  const router = inject(Router);

  const deviceService = inject(DeviceService);
  const deviceId = deviceService.getDeviceId();

  const authReq = req.clone({
    withCredentials: true,
    setHeaders: {
      ...(deviceId && { 'x-device-id': deviceId }),
    },
  });

  return next(authReq).pipe(
    catchError((err) => {
      if (
        (err.status === 401 || err.status === 403) &&
        !req.url.includes('/auth/login') &&
        !req.url.includes('/auth/refresh') &&
        !req.url.includes('/auth/logout')
      ) {
        return handle401Error(authReq, next, authService, logOut, router);
      }

      return throwError(() => err);
    }),
  );
};

function handle401Error(
  request: HttpRequest<any>,
  next: HttpHandlerFn,
  rft: RefreshTokenUseCase,
  los: LogoutUseCase,
  router: Router,
) {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return rft.execute({}).pipe(
      switchMap((res) => {
        isRefreshing = false;
        refreshTokenSubject.next(res);
        return next(
          request.clone({
            setHeaders: { Authorization: `Bearer ${res}` },
          }),
        );
      }),
      catchError((err) => {
        isRefreshing = false;
        return los.execute({}).pipe(
          switchMap(() => {
            router.navigate(['/iniciar-sesion']);
            return throwError(() => err);
          }),
          catchError(() => {
            router.navigate(['/iniciar-sesion']);
            return throwError(() => err);
          }),
        );
      }),
    );
  } else {
    return refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) =>
        next(
          request.clone({
            setHeaders: { Authorization: `Bearer ${token}` },
          }),
        ),
      ),
    );
  }
}
