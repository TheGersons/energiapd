import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PermissionsService } from '@base/service/permissions.service';

export const permissionGuard = (requiredSlugs: string[]): CanActivateFn => {
  return () => {
    const permissions = inject(PermissionsService);
    const router = inject(Router);

    if (permissions.hasAny(requiredSlugs)) return true;

    router.navigate(['/']);
    return false;
  };
};
