import { Observable } from 'rxjs';
import { UserModel, UserPayloadModel, UserResponseModel } from './user.model';

export abstract class UserRepository {
  abstract findAllUsers(): Observable<UserModel[]>;
  abstract findOneUser(user: Partial<UserModel>): Observable<UserModel>;
  abstract createUser(user: UserPayloadModel): Observable<UserResponseModel>;
  abstract update(user: UserPayloadModel): Observable<number>;
}
