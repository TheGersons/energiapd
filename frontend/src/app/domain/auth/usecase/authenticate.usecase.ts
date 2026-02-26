import { inject, Injectable } from '@angular/core';
import { UseCase } from '@base/use-case';
import { AuthRepository } from '../auth.repository';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticateUseCase implements UseCase<
  { login: string; password: string },
  string
> {
  private authRepository = inject(AuthRepository);

  execute(params: { login: string; password: string }): Observable<string> {
    return this.authRepository.authenticate(params.login, params.password);
  }
}
