import { inject, Injectable } from '@angular/core';
import { UseCase } from '@base/use-case';
import { AuthRepository } from '../auth.repository';
import { map, Observable, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LoadPermissionsUseCase } from '@domain/permission/usecase/loadPermissions.usecase';

@Injectable({
  providedIn: 'root',
})
export class AuthenticateUseCase implements UseCase<
  { login: string; password: string },
  { idUser: string; requestChangePass: boolean }
> {
  private authRepository = inject(AuthRepository);
  private loadPermissions = inject(LoadPermissionsUseCase);
  private router = inject(Router);

  execute(params: {
    login: string;
    password: string;
  }): Observable<{ idUser: string; requestChangePass: boolean }> {
    return this.authRepository.authenticate(params.login, params.password).pipe(
      switchMap(() => this.loadPermissions.execute()),
      map(() => ''),
      tap(() => this.router.navigate(['/'])),
    );
  }
}
