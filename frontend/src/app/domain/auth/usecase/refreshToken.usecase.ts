import { inject, Injectable } from '@angular/core';
import { UseCase } from '@base/use-case';
import { AuthRepository } from '../auth.repository';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RefreshTokenUseCase implements UseCase<{}, string> {
  private authRepository = inject(AuthRepository);

  execute(params: {}): Observable<string> {
    return this.authRepository.refreshToken();
  }
}
