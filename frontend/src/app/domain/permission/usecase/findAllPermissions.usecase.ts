import { inject, Injectable } from '@angular/core';
import { UseCase } from '@base/use-case';
import { PermissionModel } from '../permission.model';
import { PermissionRepository } from '../permission.repository';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FindAllPermissionsUseCase
  implements UseCase<{}, PermissionModel[]>
{
  private permissionRepository = inject(PermissionRepository);

  execute(params: {}): Observable<PermissionModel[]> {
    return this.permissionRepository.findAllPermissions();
  }
}
