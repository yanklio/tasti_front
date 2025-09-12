import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  // TODO: Implement login and logout methods
  isLogged = signal(false);
  http = inject(HttpClient);

  isLoggedIn(): boolean {
    return this.isLogged();
  }

  async login() {
    this.isLogged.set(true);

    this.http
      .post<AuthResponse>('http://localhost:8000/api/v1/auth/login/', {
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
