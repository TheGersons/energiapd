import { inject, Injectable } from '@angular/core';
import { UseCase } from '@base/use-case';
import { RoleModel } from '../role.model';
import { RoleRepository } from '../role.repository';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CreateRoleUseCase implements UseCase<RoleModel, RoleModel> {
  private roleRepository = inject(RoleRepository);

  execute(params: RoleModel): Observable<RoleModel> {
    return this.roleRepository.createRole(params);
  }
}
