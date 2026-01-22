import { Observable } from 'rxjs';
import {
  PermissionModel,
  PermissionsByRoleModel,
  RolePagePermissionModel,
} from './permission.model';

export abstract class PermissionRepository {
  abstract findAllPermissions(): Observable<PermissionModel[]>;
  abstract findAllPermissionsByRole(
    roleId: string,
  ): Observable<PermissionsByRoleModel>;
  abstract createPermissionForRole(
    rolePagePermission: RolePagePermissionModel,
  ): Observable<RolePagePermissionModel>;
  abstract deletePermissionOfRole(
    pageId: string,
    permissionId: string,
    roleId: string,
  ): Observable<number>;
}
