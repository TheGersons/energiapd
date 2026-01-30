import { inject, Injectable } from '@angular/core';
import { UseCase } from '@base/use-case';
import { PlaneRoleModel, RoleModel } from '../role.model';
import { RoleRepository } from '../role.repository';
import { Observable } from 'rxjs';
import { PartialPlaneRoleMapper } from '@data/role/mapper/partialPlaneRole.mapper';

@Injectable({
  providedIn: 'root',
})
export class FindOneRoleUseCase implements UseCase<Partial<PlaneRoleModel>, RoleModel> {
  private roleRepository = inject(RoleRepository);

  execute(params: Partial<PlaneRoleModel>): Observable<RoleModel> {
    return this.roleRepository.findOneRole(params);
  }
}
