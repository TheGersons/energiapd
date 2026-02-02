import { inject, Injectable } from '@angular/core';
import { UseCase } from '@base/use-case';
import { RoleRepository } from '../role.repository';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeleteRoleUseCase implements UseCase<string, number> {
  private roleRepository = inject(RoleRepository);

  execute(params: string): Observable<number> {
    return this.roleRepository.delete(params);
  }
}
