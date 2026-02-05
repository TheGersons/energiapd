import { inject, Injectable } from '@angular/core';
import { UseCase } from '@base/use-case';
import { UserModel, UserResponseModel } from '../user.model';
import { UserRepository } from '../user.repository';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FindOneUserUseCase implements UseCase<UserModel, UserResponseModel> {
  private repository = inject(UserRepository);

  execute(params: Partial<UserModel>): Observable<UserResponseModel> {
    return this.repository.findOneUser(params);
  }
}
