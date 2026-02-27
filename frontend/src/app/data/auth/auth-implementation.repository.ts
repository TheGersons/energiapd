import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthRepository } from '@domain/auth/auth.repository';
import { environment } from 'environments/environment.development';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthImplementation extends AuthRepository {
  private http = inject(HttpClient);
  private baseURL = `${environment.baseURL}auth`;
  private router = inject(Router);

  private readonly TOKEN_KEY = 'at';

  override authenticate(login: string, password: string): Observable<string> {
    return this.http
      .post<string>(`${this.baseURL}`, {
        password,
        login,
      })
      .pipe(
        tap((res) => {
          this.router.navigate(['/configuraciones/permisos']);
        }),
      );
  }

  override refreshToken(): Observable<string> {
    return this.http.post<string>(`${this.baseURL}/refresh`, {});
  }

  override logout(): Observable<string> {
    return this.http.post<string>(`${this.baseURL}/logout`, {});
  }

  override check(): Observable<{ ok: boolean }> {
    return this.http.get<{ ok: boolean }>(`${this.baseURL}/check`, {
      withCredentials: true,
    });
  }
}
