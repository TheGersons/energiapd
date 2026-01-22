import { ModuleRepository } from '@domain/module/module.repository';
import { ModuleMapper } from './mapper/module-page.mapper';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.development';
import { ModuleModel } from '@domain/module/module.model';
import { map, Observable } from 'rxjs';
import { ModuleEntity } from './entity/module.entity';

@Injectable({
  providedIn: 'root',
})
export class ModuleImplementation extends ModuleRepository {
  private moduleMapper = new ModuleMapper();
  private http = inject(HttpClient);
  private baseURL = environment.baseURL;

  override findAllWithPages(): Observable<ModuleModel[]> {
    return this.http
      .get<ModuleEntity[]>(`${this.baseURL}module/findAllWithPages`)
      .pipe(map(this.moduleMapper.mapFrom));
  }
}
