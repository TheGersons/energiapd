import { inject, Injectable } from '@angular/core';
import { UserRepository } from '@domain/user/user.repository';
import { UserMapper } from './mapper/user.mapper';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.development';
import { UserModel, UserModelDTO } from '@domain/user/user.model';
import { map, Observable } from 'rxjs';
import { UserEntity, UserEntityDTO } from './user.entity';
import { UserDTOMapper } from './mapper/userDTO.mapper';

@Injectable({
  providedIn: 'root',
})
export class UserImplementation extends UserRepository {
  private userMapper = new UserMapper();
  private userDTOMapper = new UserDTOMapper();
  private http = inject(HttpClient);
  private baseURL = environment.baseURL;

  override findAll(): Observable<UserModel[]> {
    return this.http
      .get<UserEntity[]>(`${this.baseURL}user/findAll`)
      .pipe(map((entities) => entities.map(this.userMapper.mapFrom)));
  }
  override createUser(user: UserModelDTO): Observable<UserModelDTO> {
    return this.http
      .post<UserEntityDTO>(`${this.baseURL}user/create`, {
        user: this.userDTOMapper.mapTo(user),
      })
      .pipe(map(this.userDTOMapper.mapFrom));
  }
}
