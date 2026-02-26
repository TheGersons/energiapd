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
      .post<string>(
        `${this.baseURL}`,
        {
          password,
          login,
        },
        {
          withCredentials: true,
        },
      )
      .pipe(
        tap((res) => {
          this.saveToken(res);
          this.router.navigate(['/configuraciones/permisos']);
        }),
      );
  }

  override refreshToken(): Observable<string> {
    return this.http
      .post<string>(`${this.baseURL}refresh`, {}, { withCredentials: true })
      .pipe(tap((res) => this.saveToken(res)));
  }

  private saveToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  override logout(): Observable<string> {
    localStorage.removeItem(this.TOKEN_KEY);
    return this.http.post<string>(
      `${this.baseURL}logout`,
      {},
      { withCredentials: true },
    );
  }
}
