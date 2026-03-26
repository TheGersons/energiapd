import { Observable } from 'rxjs';

export abstract class AuthRepository {
  abstract authenticate(
    login: string,
    password: string,
  ): Observable<{ idUser: string; requestChangePass: boolean }>;
  abstract refreshToken(): Observable<string>;
  abstract check(): Observable<{ ok: boolean }>;
  abstract logout(): Observable<number>;
}
