import { Observable } from 'rxjs';
import { DepartmentModel } from './department.model';

export abstract class DepartmentRepository {
  abstract findAllDepartments(): Observable<DepartmentModel[]>;
  abstract findOneDepartment(id: string): Observable<DepartmentModel>;
  abstract createDepartment(department: DepartmentModel): Observable<string>;
  abstract updateDepartment(department: DepartmentModel): Observable<number>;
}
