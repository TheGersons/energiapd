import { inject, Injectable } from '@angular/core';
import { UseCase } from '@base/use-case';
import { PlaneRoleModel, RoleModel } from '../role.model';
import { RoleRepository } from '../role.repository';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FindAllRolesUseCase implements UseCase<{}, PlaneRoleModel[]> {
  private roleRepository = inject(RoleRepository);

  execute(params: {}): Observable<PlaneRoleModel[]> {
    return this.roleRepository.findAllRoles();
  }
}
