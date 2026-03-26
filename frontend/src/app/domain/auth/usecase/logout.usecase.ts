import { inject, Injectable } from '@angular/core';
import { UseCase } from '@base/use-case';
import { AuthRepository } from '../auth.repository';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LogoutUseCase implements UseCase<void, number> {
  private authRepository = inject(AuthRepository);

  execute(params: void): Observable<number> {
    return this.authRepository.logout();
  }
}
