import { inject, Injectable } from '@angular/core';
import { AuthRepository } from '../auth.repository';
import { UseCase } from '@base/use-case';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckUseCase implements UseCase<{}, { ok: boolean }> {
  private authRepository = inject(AuthRepository);
  execute(params: {}): Observable<{ ok: boolean }> {
    return this.authRepository.check();
  }
}
