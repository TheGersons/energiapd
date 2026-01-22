import { inject, Injectable } from '@angular/core';
import { UseCase } from '@base/use-case';
import { PermissionsByRoleModel } from '../permission.model';
import { PermissionRepository } from '../permission.repository';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FindAllPermissionsByRoleUseCase
  implements UseCase<{ roleId: string }, PermissionsByRoleModel>
{
  private permissionRepository = inject(PermissionRepository);

  execute(params: { roleId: string }): Observable<PermissionsByRoleModel> {
    return this.permissionRepository.findAllPermissionsByRole(params.roleId);
  }
}
