import { Observable } from 'rxjs';
import { NavigationStateModel } from './navigation-state.model';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export abstract class NavigationStateRepository {
  abstract saveState(state: NavigationStateModel): Observable<void>;
  abstract getState(componentKey: string): Observable<any>;
  abstract clearState(componentKey: string): Observable<void>;
}
