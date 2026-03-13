import { inject, Injectable } from '@angular/core';
import { UseCase } from '@base/use-case';
import { DepartmentModel } from '../department.model';
import { Observable } from 'rxjs';
import { DepartmentRepository } from '../department.repository';

@Injectable({
  providedIn: 'root',
})
export class CreateDepartmentUseCase implements UseCase<
  DepartmentModel,
  string
> {
  private repository = inject(DepartmentRepository);
  execute(params: DepartmentModel): Observable<string> {
    return this.repository.createDepartment(params);
  }
}
