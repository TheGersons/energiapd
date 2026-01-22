import { Injectable, inject } from '@angular/core';
import { UseCase } from '@base/use-case';
import { NavigationStateRepository } from '../navigation-state.repository';
import { NavigationStateModel } from '../navigation-state.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SaveNavigationStateUseCase
  implements UseCase<NavigationStateModel, void>
{
  private navigationStateRepository = inject(NavigationStateRepository);

  execute(params: NavigationStateModel): Observable<void> {
    return this.navigationStateRepository.saveState(params);
  }
}
