import { Observable } from 'rxjs';
import { UserModel, UserModelDTO } from './user.model';

export abstract class UserRepository {
  abstract findAll(): Observable<UserModel[]>;
  abstract createUser(user: UserModelDTO): Observable<UserModelDTO>;
}
