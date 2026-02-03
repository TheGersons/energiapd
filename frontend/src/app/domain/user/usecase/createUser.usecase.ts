import { inject, Injectable } from '@angular/core';
import { UseCase } from '@base/use-case';
import { UserPayloadModel, UserResponseModel } from '../user.model';
import { Observable } from 'rxjs';
import { UserRepository } from '../user.repository';

@Injectable({
  providedIn: 'root',
})
export class CreateUserUseCase implements UseCase<
  UserPayloadModel,
  { id: string }
> {
  private repository = inject(UserRepository);
  execute(params: UserPayloadModel): Observable<{ id: string }> {
    return this.repository.createUser(params);
  }
}
