import { inject, Injectable } from '@angular/core';
import { UseCase } from '@base/use-case';
import { RoleModel } from '../role.model';
import { Observable } from 'rxjs';
import { RoleRepository } from '../role.repository';

@Injectable({
  providedIn: 'root',
})
export class FindAllRolesUseCase implements UseCase<{}, RoleModel[]> {
  private roleRepository = inject(RoleRepository);

  execute(params: {}): Observable<RoleModel[]> {
    return this.roleRepository.findAllRoles();
  }
}
