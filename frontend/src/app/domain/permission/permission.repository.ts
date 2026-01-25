import { Observable } from 'rxjs';
import { PermissionModel } from './permission.model';

export abstract class PermissionRepository {
  abstract findAllPermissions(): Observable<PermissionModel[]>;
}
