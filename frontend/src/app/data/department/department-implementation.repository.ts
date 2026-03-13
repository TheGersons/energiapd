import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DepartmentRepository } from '@domain/department/department.repository';
import { environment } from 'environments/environment.development';
import { DepartmentMapper } from './mapper/department.mapper';
import { DepartmentsMapper } from './mapper/departments.mapper';
import { DepartmentModel } from '@domain/department/department.model';
import { map, Observable } from 'rxjs';
import { DepartmentEntity } from './department.entity';

@Injectable({
  providedIn: 'root',
})
export class DepartmentImplementation extends DepartmentRepository {
  private http = inject(HttpClient);
  private baseURL = `${environment.baseURL}department/`;
  private departmentMapper = new DepartmentMapper();
  private departmentsMapper = new DepartmentsMapper();

  override createDepartment(department: DepartmentModel): Observable<string> {
    return this.http.post<string>(this.baseURL, {
      department: this.departmentMapper.mapTo(department),
    });
  }

  override findAllDepartments(): Observable<DepartmentModel[]> {
    return this.http
      .get<DepartmentEntity[]>(this.baseURL)
      .pipe(map(this.departmentsMapper.mapFrom));
  }

  override findOneDepartment(id: string): Observable<DepartmentModel> {
    return this.http
      .get<DepartmentEntity>(`${this.baseURL}one`, {
        params: { id },
      })
      .pipe(map(this.departmentMapper.mapFrom));
  }

  override updateDepartment(department: DepartmentModel): Observable<number> {
    return this.http.put<number>(this.baseURL, {
      department: this.departmentMapper.mapTo(department),
    });
  }
}
