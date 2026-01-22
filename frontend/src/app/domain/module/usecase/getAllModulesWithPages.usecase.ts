import { UseCase } from '@base/use-case';
import { Injectable, inject } from '@angular/core';
import { ModuleRepository } from '../module.repository';
import { Observable } from 'rxjs';
import { ModuleModel } from '../module.model';

@Injectable({
  providedIn: 'root',
})
export class GetAllModulesWitPages implements UseCase<{}, ModuleModel[]> {
  private modelRepository = inject(ModuleRepository);

  execute(params: {}): Observable<ModuleModel[]> {
    return this.modelRepository.findAllWithPages();
  }
}
