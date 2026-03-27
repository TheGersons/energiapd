import { inject, Injectable } from '@angular/core';
import { UseCase } from '@base/use-case';
import { AuthRepository } from '../auth.repository';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ForgotPasswordUseCase implements UseCase<string, boolean> {
  private readonly repository = inject(AuthRepository);

  execute(params: string): Observable<boolean> {
    return this.repository.forgotPassword(params);
  }
}
