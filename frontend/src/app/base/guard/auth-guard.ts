import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CheckUseCase } from '@domain/auth/usecase/check.usecase';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const check = inject(CheckUseCase);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  return check.execute({}).pipe(
    map(() => true),
    catchError(() => of(router.createUrlTree(['/iniciar-sesion']))),
  );
};
