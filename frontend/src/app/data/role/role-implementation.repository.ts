import { inject, Injectable } from '@angular/core';
import { RoleRepository } from '@domain/role/role.repository';
import { RoleMapper } from './mapper/role.mapper';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.development';
import { RoleModel } from '@domain/role/role.model';
import { map, Observable } from 'rxjs';
import { RoleEntity } from './role.entity';
import { RolesMapper } from './mapper/roles.mapper';

@Injectable({
  providedIn: 'root',
})
export class RoleImplementation extends RoleRepository {
  private roleMapper = new RoleMapper();
  private rolesMapper = new RolesMapper();
  private http = inject(HttpClient);
  private baseURL = environment.baseURL;

  override createRole(role: RoleModel): Observable<RoleModel> {
    return this.http
      .post<RoleEntity>(`${this.baseURL}role/create`, {
        role: this.roleMapper.mapTo(role),
      })
      .pipe(map(this.roleMapper.mapFrom));
  }

  override findAllRoles(): Observable<RoleModel[]> {
    return this.http
      .get<RoleEntity[]>(`${this.baseURL}role/findAll`)
      .pipe(map(this.rolesMapper.mapFrom));
  }

  override updateRole(role: RoleModel): Observable<number> {
    return this.http.put<number>(`${this.baseURL}role/update`, {
      role: this.roleMapper.mapTo(role),
    });
  }

  override deleteRole(id: string): Observable<number> {
    return this.http.delete<number>(`${this.baseURL}role/delete?roleId=${id}`);
  }
}
