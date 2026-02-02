import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import {
  UserModel,
  UserPayloadModel,
  UserResponseModel,
} from '@domain/user/user.model';
import { UserRepository } from '@domain/user/user.repository';
import { environment } from 'environments/environment.development';
import { map, Observable } from 'rxjs';
import { UserEntity, UserResponseEntity } from './user.entity';
import { UsersMapper } from './mapper/users.mapper';
import { UserMapper } from './mapper/user.mapper';
import { UserPayloadMapper } from './mapper/user-payload.mapper';
import { UserResponseMapper } from './mapper/user-response.mapper';

export class UserImplementationRepository extends UserRepository {
  private http = inject(HttpClient);
  private baseURL = `${environment.baseURL}role`;

  private usersMapper = inject(UsersMapper);
  private userMapper = inject(UserMapper);
  private userPayloadMapper = inject(UserPayloadMapper);
  private userResponseMapper = inject(
    UserResponseMapper)

  override findAllUsers(): Observable<UserModel[]> {
    return this.http
      .get<UserEntity[]>(this.baseURL)
      .pipe(map(this.usersMapper.mapFrom));
  }

  override findOneUser(user: Partial<UserModel>): Observable<UserModel> {
    return this.http
      .get<UserEntity>(`${this.baseURL}user/one`)
      .pipe(map(this.userMapper.mapFrom));
  }

  override update(user: UserPayloadModel): Observable<number> {
    return this.http.put<number>(this.baseURL, {
      user: this.userPayloadMapper.mapTo(user),
    });
  }

  override createUser(user: UserPayloadModel): Observable<UserResponseModel> {
    return this.http.post<UserResponseEntity>(this.baseURL, {
      user: this.userPayloadMapper.mapTo(user),
    }).pipe(map(this.userResponseMapper.mapFrom));
  }
}
