import { inject, Injectable } from '@angular/core';
import { UseCase } from '@base/use-case';
import { UserRepository } from '../user.repository';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChangePassUseCase implements UseCase<
  {
    userId?: string;
    pass: string;
    changePassword: boolean;
  },
  string
> {
  private repository = inject(UserRepository);

  execute(params: {
    userId?: string;
    pass: string;
    changePassword: boolean;
  }): Observable<string> {
    return this.repository.changePassword(
      params.pass,
      params.changePassword,
      params.userId,
    );
  }
}
