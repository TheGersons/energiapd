import { Injectable, inject } from '@angular/core';
import { UseCase } from '@base/use-case';
import { NavigationStateRepository } from '../navigation-state.repository';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClearNavigationStateUseCase
  implements UseCase<{ componentKey: string }, void>
{
  private navigationStateRepository = inject(NavigationStateRepository);

  execute(params: { componentKey: string }): Observable<void> {
    return this.navigationStateRepository.clearState(params.componentKey);
  }
}
