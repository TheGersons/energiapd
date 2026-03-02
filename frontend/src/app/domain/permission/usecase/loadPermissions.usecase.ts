import { inject, Injectable } from '@angular/core';
import { UseCase } from '@base/use-case';
import { PermissionRepository } from '../permission.repository';
import { Observable, tap } from 'rxjs';
import { PermissionsService } from '@base/service/permission.service';

@Injectable({
  providedIn: 'root',
})
export class LoadPermissionsUseCase implements UseCase<void, string[]> {
  private permissionRepository = inject(PermissionRepository);
  private permissionsService = inject(PermissionsService);

  execute(params: void): Observable<string[]> {
    return this.permissionRepository.loadPermissions().pipe(
      tap((permissions) => {
        this.permissionsService.setPermissions(permissions);
      }),
    );
  }
}
