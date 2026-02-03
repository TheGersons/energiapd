import { inject, Injectable } from '@angular/core';
import { UseCase } from '@base/use-case';
import { UserModel, UserResponseModel } from '../user.model';
import { UserRepository } from '../user.repository';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FindAllUsersUseCase implements UseCase<{}, UserResponseModel[]> {
  private repository = inject(UserRepository);
  execute(params: {}): Observable<UserResponseModel[]> {
    return this.repository.findAllUsers();
  }
}
