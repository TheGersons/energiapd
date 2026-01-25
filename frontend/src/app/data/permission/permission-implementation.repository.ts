import { inject, Injectable } from '@angular/core';
import { PermissionRepository } from '@domain/permission/permission.repository';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.development';
import { PermissionModel } from '@domain/permission/permission.model';
import { map, Observable } from 'rxjs';
import { PermissionEntity } from './permission.entity';
import { PermissionsMapper } from './mapper/permissions.mapper';

@Injectable({
  providedIn: 'root',
})
export class PermissionImplementation extends PermissionRepository {
  private permissionsMapper = new PermissionsMapper();
  private http = inject(HttpClient);
  private baseURL = environment.baseURL;

  override findAllPermissions(): Observable<PermissionModel[]> {
    return this.http
      .get<PermissionEntity[]>(`${this.baseURL}permission/catalog`)
      .pipe(map((entities) => this.permissionsMapper.mapFrom(entities)));
  }
}
