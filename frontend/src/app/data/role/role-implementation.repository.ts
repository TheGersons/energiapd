import { inject, Injectable } from '@angular/core';
import { RoleRepository } from '@domain/role/role.repository';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.development';
import { PlaneRoleModel, RoleModel } from '@domain/role/role.model';
import { map, Observable } from 'rxjs';
import { PlaneRoleEntity, RoleEntity } from './role.entity';
import { RoleMapper } from './mapper/role.mapper';
import { PlaneRoleMapper } from './mapper/planeRole.mapper';
import { PlaneRolesMapper } from './mapper/planeRoles.mapper';
import { PartialPlaneRoleMapper } from './mapper/partialPlaneRole.mapper';

@Injectable({
  providedIn: 'root',
})
export class RoleImplementation extends RoleRepository {
  private http = inject(HttpClient);
  private roleMapper = new RoleMapper();
  private planeRolesMapper = new PlaneRolesMapper();
  private partialPlaneRoleMapper = new PartialPlaneRoleMapper();
  private baseURL = environment.baseURL;

  override createRole(role: RoleModel): Observable<RoleModel> {
    return this.http
      .post<RoleEntity>(`${this.baseURL}role`, {
        role: this.roleMapper.mapTo(role),
      })
      .pipe(map(this.roleMapper.mapFrom));
  }

  override findAllRoles(): Observable<PlaneRoleModel[]> {
    return this.http
      .get<PlaneRoleEntity[]>(`${this.baseURL}role`)
      .pipe(map(this.planeRolesMapper.mapFrom));
  }

  override findOneRole(role: Partial<PlaneRoleModel>): Observable<RoleModel> {
    return this.http
      .get<RoleEntity>(`${this.baseURL}role/one`, {
        params: this.partialPlaneRoleMapper.mapTo(role),
      })
      .pipe(map(this.roleMapper.mapFrom));
  }

  override update(role: RoleModel): Observable<number> {
    return this.http.put<number>(`${this.baseURL}role`, {
      role: this.roleMapper.mapTo(role),
    });
  }
}
