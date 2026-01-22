import { Observable } from 'rxjs';
import { RoleModel } from './role.model';

export abstract class RoleRepository {
  abstract findAllRoles(): Observable<RoleModel[]>;
  abstract createRole(role: RoleModel): Observable<RoleModel>;
  abstract deleteRole(id: string): Observable<number>;
  abstract updateRole(role: RoleModel): Observable<number>;
}
