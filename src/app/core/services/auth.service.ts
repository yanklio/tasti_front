import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { UserService } from './user.service';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);

  userService = inject(UserService);

  authUrl = environment.apiUrl + 'auth/';
  isLogged = signal(false);

  isLoggedIn(): boolean {
    return this.isLogged();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.authUrl + 'login/', credentials).pipe(
      tap((response) => {
        this.isLogged.set(true);
        localStorage.setItem('access_token', response.access);
        this.userService.setUser(response.user);
      }),
    );
  }

  register(credentials: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.authUrl + 'register/', credentials).pipe(
      tap((response) => {
        this.isLogged.set(true);
        localStorage.setItem('access_token', response.access);
        this.userService.setUser(response.user);
      }),
    );
  }

  logout(): Observable<any> {
    return this.http.post(this.authUrl + 'logout/', {}).pipe(
      tap(() => {
        this.isLogged.set(false);
        localStorage.removeItem('access_token');
        this.userService.setUser(null);
      }),
    );
  }
}
