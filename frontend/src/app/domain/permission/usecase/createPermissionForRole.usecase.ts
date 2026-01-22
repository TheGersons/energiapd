import { inject, Injectable } from '@angular/core';
import { UseCase } from '@base/use-case';
import { RolePagePermissionModel } from '../permission.model';
import { PermissionRepository } from '../permission.repository';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CreatePermissionForRoleUseCase
  implements UseCase<RolePagePermissionModel, RolePagePermissionModel>
{
  private permissionRepository = inject(PermissionRepository);

  execute(
    params: RolePagePermissionModel,
  ): Observable<RolePagePermissionModel> {
    return this.permissionRepository.createPermissionForRole(params);
  }
}
