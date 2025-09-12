import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  isLogged = signal(false);
  http = inject(HttpClient);

  isLoggedIn(): boolean {
    return this.isLogged();
  }

  async login() {
    this.http
      .post<AuthResponse>(environment.apiUrl + 'auth/login/', {
        username: 'testuser123',
        password: 'mypassword123',
      })
      .subscribe((response) => {
        // Handle response
        console.log(response);
      });
  }

  logout() {
    this.isLogged.set(false);
  }
}
