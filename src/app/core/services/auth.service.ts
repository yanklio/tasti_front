import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  private readonly authUrl = environment.apiUrl + 'auth/';

  private _accessToken = signal<string | null>(null);
  readonly isAuthenticated = computed(() => this._accessToken() !== null);

  private refreshInProgress = new BehaviorSubject<boolean>(false);
  public readonly refreshInProgress$ = this.refreshInProgress.asObservable();

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const storedToken = sessionStorage.getItem('access_token');
    if (storedToken && !this.isTokenExpired(storedToken)) {
      this._accessToken.set(storedToken);
    } else {
      sessionStorage.removeItem('access_token');
    }
  }

  get accessToken(): string | null {
    return this._accessToken();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.authUrl + 'login/', credentials).pipe(
      tap((response) => {
        this.setAccessToken(response.access);
      }),
    );
  }

  register(credentials: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.authUrl + 'register/', credentials).pipe(
      tap((response) => {
        this.setAccessToken(response.access);
      }),
    );
  }

  refreshAccessToken(): Observable<AuthResponse> {
    this.refreshInProgress.next(true);

    return this.http.post<AuthResponse>(this.authUrl + 'token/refresh/', {}).pipe(
      tap((response) => {
        this.setAccessToken(response.access);
      }),
      catchError((error) => {
        this.clearAccessToken();
        throw error;
      }),
      finalize(() => {
        this.refreshInProgress.next(false);
      }),
    );
  }

  logout(): Observable<any> {
    return this.http.post(this.authUrl + 'logout/', {}).pipe(
      tap(() => {
        this.clearAccessToken();
      }),
      catchError((error) => {
        this.clearAccessToken();
        return throwError(() => error);
      }),
    );
  }

  private setAccessToken(token: string): void {
    sessionStorage.setItem('access_token', token);
    this._accessToken.set(token);
  }

  private clearAccessToken(): void {
    sessionStorage.removeItem('access_token');
    this._accessToken.set(null);
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiryTime = payload.exp * 1000;
      return Date.now() >= expiryTime - 60000;
    } catch {
      return true;
    }
  }

  shouldRefreshToken(): boolean {
    const token = this.accessToken;
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiryTime = payload.exp * 1000;
      return Date.now() >= expiryTime - 5 * 60 * 1000;
    } catch {
      return true;
    }
  }
}
