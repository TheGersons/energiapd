import { inject, Injectable } from '@angular/core';
import { UseCase } from '@base/use-case';
import { UserModel } from '../user.model';
import { UserRepository } from '../user.repository';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FindAllUsersUseCase implements UseCase<void, UserModel[]> {
  private userRepository = inject(UserRepository);
  execute(): Observable<UserModel[]> {
    return this.userRepository.findAll();
  }
}
