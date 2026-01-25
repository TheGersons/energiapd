import { inject, Injectable } from '@angular/core';
import { UseCase } from '@base/use-case';
import { Observable } from 'rxjs';
import { PermissionModel } from '../permission.model';
import { PermissionRepository } from '../permission.repository';

@Injectable({
  providedIn: 'root',
})
export class FindAllPermissionsUseCase implements UseCase<
  PermissionModel[],
  PermissionModel[]
> {
  private permissionRepository = inject(PermissionRepository);

  execute(params: {}): Observable<PermissionModel[]> {
    return this.permissionRepository.findAllPermissions();
  }
}
