import { inject, Injectable } from '@angular/core';
import { UseCase } from '@base/use-case';
import { DepartmentModel } from '../department.model';
import { DepartmentRepository } from '../department.repository';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UpdateDepartmentUseCase implements UseCase<
  DepartmentModel,
  number
> {
  private repository = inject(DepartmentRepository);

  execute(params: DepartmentModel): Observable<number> {
    return this.repository.updateDepartment(params);
  }
}
