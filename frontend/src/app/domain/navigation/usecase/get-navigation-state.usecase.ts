import { Injectable, inject } from '@angular/core';
import { UseCase } from '@base/use-case';
import { NavigationStateRepository } from '../navigation-state.repository';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GetNavigationStateUseCase
  implements UseCase<{ componentKey: string }, any>
{
  private navigationStateRepository = inject(NavigationStateRepository);

  execute(params: { componentKey: string }): Observable<any> {
    return this.navigationStateRepository.getState(params.componentKey);
  }
}
