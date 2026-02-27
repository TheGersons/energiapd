import { Observable } from 'rxjs';

export abstract class AuthRepository {
  abstract authenticate(login: string, password: string): Observable<string>;
  abstract refreshToken(): Observable<string>;
  abstract check(): Observable<{ ok: boolean }>;
  abstract logout(): Observable<string>;
  abstract loadPermissions(): Observable<string[]>;
}
