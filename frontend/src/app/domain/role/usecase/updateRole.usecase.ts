import { inject, Injectable } from '@angular/core';
import { UseCase } from '@base/use-case';
import { RoleModel } from '../role.model';
import { RoleRepository } from '../role.repository';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UpdateRoleUseCase implements UseCase<RoleModel, number> {
  private roleRepository = inject(RoleRepository);

  execute(params: RoleModel): Observable<number> {
    return this.roleRepository.update(params);
  }
}
