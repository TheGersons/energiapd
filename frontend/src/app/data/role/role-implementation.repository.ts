import { inject, Injectable } from '@angular/core';
import { RoleRepository } from '@domain/role/role.repository';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.development';
import { RoleModel } from '@domain/role/role.model';
import { map, Observable } from 'rxjs';
import { RoleEntity } from './role.entity';
import { RoleMapper } from './mapper/role.mapper';

@Injectable({
  providedIn: 'root',
})
export class RoleImplementation extends RoleRepository {
  private roleMapper = new RoleMapper();
  private http = inject(HttpClient);
  private baseURL = environment.baseURL;

  override createRole(role: RoleModel): Observable<RoleModel> {
    return this.http
      .post<RoleEntity>(`${this.baseURL}role`, {
        role: this.roleMapper.mapTo(role),
      })
      .pipe(map(this.roleMapper.mapFrom));
  }
}
