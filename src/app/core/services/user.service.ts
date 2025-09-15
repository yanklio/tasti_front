import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly STORAGE_KEY = 'user';
  user = signal<User | null>(this.loadUserFromStorage());

  constructor() {
    this.loadUserFromStorage();
  }

  setUser(user: User | null) {
    this.user.set(user);
    if (user) {
      this.saveUserToStorage(user);
    } else {
      this.removeUserFromStorage();
    }
  }

  getUser(): User | null {
    return this.user();
  }

  updateUser(updates: Partial<User>): void {
    const current = this.user();
    if (current) {
      const updated = { ...current, ...updates };
      this.setUser(updated);
    }
  }

  clearUser(): void {
    this.setUser(null);
  }

  isLoggedIn(): boolean {
    return this.user() !== null;
  }

  private loadUserFromStorage(): User | null {
    try {
      const userStr = localStorage.getItem(this.STORAGE_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error loading user from storage:', error);
      this.removeUserFromStorage();
      return null;
    }
  }

  private saveUserToStorage(user: User): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user to storage:', error);
    }
  }

  private removeUserFromStorage(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
