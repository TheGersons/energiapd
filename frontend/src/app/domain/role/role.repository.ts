import { Observable } from 'rxjs';
import { RoleModel } from './role.model';

export abstract class RoleRepository {
  abstract createRole(role: RoleModel): Observable<RoleModel>;
}
