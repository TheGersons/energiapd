import { inject, Injectable } from '@angular/core';
import { UseCase } from '@base/use-case';
import { UserModel, UserModelDTO } from '../user.model';
import { Observable } from 'rxjs';
import { UserRepository } from '../user.repository';

@Injectable({
  providedIn: 'root',
})
export class CreateUserUseCase implements UseCase<UserModelDTO, UserModelDTO> {
  private userRepository = inject(UserRepository);
  execute(params: UserModelDTO): Observable<UserModelDTO> {
    return this.userRepository.createUser(params);
  }
}
