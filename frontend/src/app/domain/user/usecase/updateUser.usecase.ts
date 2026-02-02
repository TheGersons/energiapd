import { inject, Injectable } from '@angular/core';
import { UseCase } from '@base/use-case';
import { UserPayloadModel, UserResponseModel } from '../user.model';
import { UserRepository } from '../user.repository';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UpdateUserUseCase implements UseCase<UserPayloadModel, number> {
  private repository = inject(UserRepository);

  execute(params: UserPayloadModel): Observable<number> {
    return this.repository.update(params);
  }
}
