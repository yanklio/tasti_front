import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';
import { OwnedObject } from '../types/owner';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private httpClient = inject(HttpClient);

  private _user = signal<User | null>(null);
  private _loading = signal<boolean>(false);

  private readonly cacheKey = 'user_data';

  public readonly user = computed(() => this._user());
  public readonly loading = computed(() => this._loading());
  public readonly username = computed(() => this._user()?.username);

  constructor() {
    this.initializeUser();
  }

  // try to get user on page load
  onUserAuthenticated(): void {
    if (!this._user()) {
      const cachedUser = this.getCachedUser();
      if (cachedUser) {
        this._user.set(cachedUser);
      }
    }
  }

  onUserUnauthenticated(): void {
    this.clearCurrentUser();
  }

  setCurrentUser(user: User): void {
    this._user.set(user);
    this.setCachedUser(user);
  }

  clearCurrentUser(): void {
    this.clearAllUserData();
  }

  loadCurrentUser() {
    if (this._user()) {
      const cached = this.getCachedUser();
      if (cached) return;
    }

    if (this._loading()) return;

    // TODO: Get user from API

    return null;
  }

  refreshUserData(): void {
    // TODO: Add complete user refresh logic
    // this.clearUserCache()
    // this._user.set(null)
    this.loadCurrentUser();
  }

  getCachedUser(): User | null {
    try {
      const cached = sessionStorage.getItem(this.cacheKey);
      if (!cached) return null;
      return JSON.parse(cached);
    } catch (error) {
      console.error('Error reading user cache:', error);
      sessionStorage.removeItem(this.cacheKey);
      return null;
    }
  }

  setCachedUser(user: User | null): void {
    try {
      console.log('settin user', user);
      sessionStorage.setItem(this.cacheKey, JSON.stringify(user));
    } catch (error) {
      console.error('Error caching user:', error);
    }
  }

  private initializeUser() {
    const cachedUser = this.getCachedUser();
    if (cachedUser) {
      this._user.set(cachedUser);
    }
  }

  private clearUserCache(): void {
    sessionStorage.removeItem(this.cacheKey);
  }

  private clearAllUserData(): void {
    this._user.set(null);
    this.clearUserCache();
  }

  isOwner(object?: OwnedObject) {
    if (!this.username() || !object) return false;

    return object.owner === this.username();
  }
}
