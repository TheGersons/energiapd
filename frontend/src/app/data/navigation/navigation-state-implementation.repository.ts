import { Injectable } from '@angular/core';
import { NavigationStateRepository } from '@domain/navigation/navigation-state.repository';
import { NavigationStateModel } from '@domain/navigation/navigation-state.model';
import { Observable, of, timestamp } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavigationStateImplementation extends NavigationStateRepository {
  private stateMap = new Map<string, any>();

  override saveState(state: NavigationStateModel): Observable<void> {
    this.stateMap.set(state.componentKey, {
      data: state.state,
      timestamp: state.timestamp,
    });

    try {
      sessionStorage.setItem(
        `nav_state_${state.componentKey}`,
        JSON.stringify({ data: state.state, timestamp: timestamp }),
      );
    } catch (e) {}

    return of(void 0);
  }

  override getState(componentKey: string): Observable<any> {
    let state = this.stateMap.get(componentKey);

    if (!state) {
      try {
        const storedState = sessionStorage.getItem(
          `nav_state_${state.componentKey}`,
        );
        if (storedState) {
          state = JSON.parse(storedState).data;
          this.stateMap.set(componentKey, JSON.parse(storedState));
        }
      } catch (e) {
        console.warn('No se pudo obtener de sessionStorage');
      }
    }

    return of(state);
  }

  override clearState(componentKey: string): Observable<void> {
    this.stateMap.delete(componentKey);
    try {
      sessionStorage.removeItem(`nav_state_${componentKey}`);
    } catch (e) {
      console.warn('No se pudo limpiar de sessionStorage');
    }

    return of(void 0);
  }
}
