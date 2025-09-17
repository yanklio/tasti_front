import { computed, effect, inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private authService = inject(AuthService);
  private userService = inject(UserService);

  public readonly isAuthenticated = computed(() => this.authService.isAuthenticated());
  public readonly user = computed(() => this.userService.user());
  public readonly loading = computed(() => {
    return this.authService.refreshInProgress$ || this.userService.loading();
  });

  public readonly sessionReady = computed(() => {
    return this.isAuthenticated() && this.user() !== null && !this.loading();
  });

  constructor() {
    effect(() => {
      if (this.isAuthenticated()) {
        this.userService.onUserAuthenticated();
      } else {
        this.userService.onUserUnauthenticated();
      }
    });
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.authService.login(credentials).pipe(
      tap((response) => {
        if (response.user) {
          this.userService.setCurrentUser(response.user);
        }
      }),
    );
  }

  register(credentials: RegisterRequest): Observable<AuthResponse> {
    return this.authService.register(credentials).pipe(
      tap((response) => {
        if (response.user) {
          this.userService.setCurrentUser(response.user);
        }
      }),
    );
  }

  logout() {
    this.authService.logout().pipe(
      tap(() => {
        this.userService.clearCurrentUser();
      }),
    );
  }

  refreshToken(): Observable<AuthResponse> {
    return this.authService.refreshAccessToken().pipe(
      tap((response) => {
        if (response.user) {
          this.userService.setCurrentUser(response.user);
        }
      }),
    );
  }
}
