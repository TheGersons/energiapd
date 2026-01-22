import { inject, Injectable } from '@angular/core';
import { UseCase } from '@base/use-case';
import { Observable } from 'rxjs';
import { PermissionRepository } from '../permission.repository';

@Injectable({
  providedIn: 'root',
})
export class DeletePermissionOfRoleUseCase
  implements UseCase<{ pageId: string; permissionId: string, roleId: string }, Number>
{
  private permissionRepository = inject(PermissionRepository);
  execute(params: {
    pageId: string;
    permissionId: string;
    roleId: string
  }): Observable<number> {
    return this.permissionRepository.deletePermissionOfRole(
      params.pageId,
      params.permissionId,
      params.roleId
    );
  }
}
