import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

function getCookie(name: string): string | null {
  const matches = document.cookie.match(
    new RegExp(
      `(?:^|; )${name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, '\\$1')}=([^;]*)`,
    ),
  );
  return matches ? decodeURIComponent(matches[1]) : null;
}

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  console.log('Platform ID:', platformId);
  console.log('Es navegador:', isPlatformBrowser(platformId));

  if (!isPlatformBrowser(platformId)) {
    console.log('Ejecución en el servidor, acceso permitido temporalmente.');
    return true; // Permitir acceso temporalmente en el servidor
  }

  console.log('Ejecución en el navegador.');
  const accessToken = getCookie('accessToken');

  if (accessToken) {
    return true;
  }

  console.log('Redirigiendo al inicio de sesión.');
  return router.createUrlTree(['/iniciar-sesion']);
};
