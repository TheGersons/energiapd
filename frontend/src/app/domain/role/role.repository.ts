import { Observable } from 'rxjs';
import { PlaneRoleModel, RoleModel } from './role.model';

export abstract class RoleRepository {
  abstract createRole(role: RoleModel): Observable<RoleModel>;
  abstract findAllRoles(): Observable<PlaneRoleModel[]>;
  abstract findOneRole(role: Partial<PlaneRoleModel>): Observable<RoleModel>;
  abstract update(role: RoleModel): Observable<number>;
}
