import { Observable } from 'rxjs';
import { UserModel, UserPayloadModel, UserResponseModel } from './user.model';

export abstract class UserRepository {
  abstract findAllUsers(): Observable<UserResponseModel[]>;
  abstract findOneUser(user: Partial<UserModel>): Observable<UserResponseModel>;
  abstract createUser(user: UserPayloadModel): Observable<{ id: string }>;
  abstract update(user: UserPayloadModel): Observable<number>;
  abstract activeCount(): Observable<number>;
  abstract inactiveCount(): Observable<number>;
  abstract totalCount(): Observable<number>;
}
