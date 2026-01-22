import { Observable } from 'rxjs';
import { ModuleModel } from './module.model';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export abstract class ModuleRepository {
  abstract findAllWithPages(): Observable<ModuleModel[]>;
}
