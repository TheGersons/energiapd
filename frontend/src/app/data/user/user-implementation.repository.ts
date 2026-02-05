import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
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
import { UsersResponseMapper } from './mapper/users-response.mapper';
import { PartialUserModelMapper } from './mapper/partial-userModel.mapper';

@Injectable({
  providedIn: 'root',
})
export class UserImplementation extends UserRepository {
  private http = inject(HttpClient);
  private baseURL = `${environment.baseURL}user`;

  private usersResponseMapper = new UsersResponseMapper();
  private partialUserModelMapper = new PartialUserModelMapper();
  private userPayloadMapper = new UserPayloadMapper();
  private userResponseMapper = new UserResponseMapper();

  override findAllUsers(): Observable<UserResponseModel[]> {
    return this.http
      .get<UserResponseEntity[]>(this.baseURL)
      .pipe(map(this.usersResponseMapper.mapFrom));
  }

  override findOneUser(
    user: Partial<UserModel>,
  ): Observable<UserResponseModel> {
    return this.http
      .get<UserResponseEntity>(`${this.baseURL}/one`, {
        params: this.partialUserModelMapper.mapTo(user),
      })
      .pipe(map(this.userResponseMapper.mapFrom));
  }

  override update(user: UserPayloadModel): Observable<number> {
    return this.http.put<number>(this.baseURL, {
      user: this.userPayloadMapper.mapTo(user),
    });
  }

  override createUser(user: UserPayloadModel): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(this.baseURL, {
      user: this.userPayloadMapper.mapTo(user),
    });
  }
}
