import { inject, Injectable } from '@angular/core';
import { UseCase } from '@base/use-case';
import { Observable, raceWith } from 'rxjs';
import { RoleRepository } from '../role.repository';

@Injectable({
  providedIn: 'root',
})
export class DeleteRoleUseCase implements UseCase<{ roleId: string }, number> {
  private roleRepository = inject(RoleRepository);
  execute(params: { roleId: string }): Observable<number> {
    return this.roleRepository.deleteRole(params.roleId);
  }
}
