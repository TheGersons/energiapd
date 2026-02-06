import { inject, Injectable } from '@angular/core';
import { UseCase } from '@base/use-case';
import { UserRepository } from '../user.repository';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InactiveUsersUseCase implements UseCase<{}, number> {
  private repository = inject(UserRepository);
  execute(params: {}): Observable<number> {
    return this.repository.inactiveCount();
  }
}
