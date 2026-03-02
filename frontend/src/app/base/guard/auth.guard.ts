import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PermissionsService } from '@base/service/permission.service';
import { CheckUseCase } from '@domain/auth/usecase/check.usecase';
import { LoadPermissionsUseCase } from '@domain/permission/usecase/loadPermissions.usecase';
import { catchError, map, of, switchMap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const check = inject(CheckUseCase);
  const loadPermissions = inject(LoadPermissionsUseCase);
  const permissionsService = inject(PermissionsService);

  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  if (permissionsService.isLoaded()) return true;

  return check.execute({}).pipe(
    switchMap(() => loadPermissions.execute()),
    map(() => true),
    catchError(() => of(router.createUrlTree(['/iniciar-sesion']))),
  );
};
