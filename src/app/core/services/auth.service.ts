import { Injectable, signal } from '@angular/core';

@Injectable()
export class AuthService {
  constructor() {}

  // TODO: Implement login and logout methods
  isLogged = signal(false);

  isLoggedIn(): boolean {
    return this.isLogged();
  }

  login() {
    this.isLogged.set(true);
  }

  logout() {
    this.isLogged.set(false);
  }
}
