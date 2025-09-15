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
  private http = inject(HttpClient);

  private userService = inject(UserService);

  private readonly authUrl = environment.apiUrl + 'auth/';
  private readonly ACCESS_TOKEN = 'access_token';

  isLogged = signal(false);

  isLoggedIn(): boolean {
    return this.isLogged();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.authUrl + 'login/', credentials).pipe(
      tap((response) => {
        this.isLogged.set(true);
        localStorage.setItem(this.ACCESS_TOKEN, response.access);
        this.userService.setUser(response.user);
      }),
    );
  }

  register(credentials: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.authUrl + 'register/', credentials).pipe(
      tap((response) => {
        this.isLogged.set(true);
        localStorage.setItem(this.ACCESS_TOKEN, response.access);
        this.userService.setUser(response.user);
      }),
    );
  }

  logout(): Observable<any> {
    return this.http.post(this.authUrl + 'logout/', {}).pipe(
      tap(() => {
        this.isLogged.set(false);
        localStorage.removeItem(this.ACCESS_TOKEN);
        this.userService.setUser(null);
      }),
    );
  }
}
