import { inject, Injectable } from '@angular/core';
import { PermissionRepository } from '@domain/permission/permission.repository';
import { RolePagePermissionMapper } from './mapper/rolePagePermission.mapper';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.development';
import {
  PermissionModel,
  PermissionsByRoleModel,
  RolePagePermissionModel,
} from '@domain/permission/permission.model';
import { map, Observable } from 'rxjs';
import {
  PermissionEntity,
  PermissionsByRoleEntity,
  RolePagePermissionEntity,
} from './permission.entity';
import { PermissionMapper } from './mapper/permission.mapper';
import { PermissionByRoleMapper } from './mapper/permissionsByRole.mapper';

@Injectable({
  providedIn: 'root',
})
export class PermissionImplementation extends PermissionRepository {
  private rolePagePermissionMapper = new RolePagePermissionMapper();
  private permissionByRoleMapper = new PermissionByRoleMapper();
  private permissionMapper = new PermissionMapper();
  private http = inject(HttpClient);
  private baseURL = environment.baseURL;

  override findAllPermissions(): Observable<PermissionModel[]> {
    return this.http
      .get<PermissionEntity[]>(`${this.baseURL}permission/findAll`)
      .pipe(map(this.permissionMapper.mapFrom));
  }

  override findAllPermissionsByRole(
    roleId: string,
  ): Observable<PermissionsByRoleModel> {
    return this.http
      .get<PermissionsByRoleEntity>(
        `${this.baseURL}permission/findPermissionsByRole?id=${roleId}`,
      )
      .pipe(map(this.permissionByRoleMapper.mapFrom));
  }

  override createPermissionForRole(
    rolePagePermission: RolePagePermissionModel,
  ): Observable<RolePagePermissionModel> {
    return this.http
      .post<RolePagePermissionEntity>(
        `${this.baseURL}role-page-permission/create`,
        {
          rolePagePermission:
            this.rolePagePermissionMapper.mapTo(rolePagePermission),
        },
      )
      .pipe(map(this.rolePagePermissionMapper.mapFrom));
  }

  override deletePermissionOfRole(
    pageId: string,
    permissionId: string,
    roleId: string,
  ): Observable<number> {
    return this.http.delete<number>(
      `${this.baseURL}role-page-permission/delete?idPage=${pageId}&idPermission=${permissionId}&idRole=${roleId}`,
    );
  }
}
