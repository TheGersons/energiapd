import { Observable } from 'rxjs';

export abstract class AuthRepository {
  abstract authenticate(login: string, password: string): Observable<string>;
  abstract refreshToken(): Observable<string>;
  abstract logout(): Observable<string>;
}
