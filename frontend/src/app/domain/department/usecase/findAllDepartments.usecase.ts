import { inject, Injectable } from '@angular/core';
import { UseCase } from '@base/use-case';
import { DepartmentModel } from '../department.model';
import { DepartmentRepository } from '../department.repository';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FindAllDepartmentsUseCase implements UseCase<
  void,
  DepartmentModel[]
> {
  private repository = inject(DepartmentRepository);

  execute(params: void): Observable<DepartmentModel[]> {
    return this.repository.findAllDepartments();
  }
}
