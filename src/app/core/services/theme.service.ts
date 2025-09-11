import { Injectable, signal } from '@angular/core';

type themeOptions = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private _theme = signal<themeOptions>('system');
  private readonly THEME_KEY = 'app-theme';

  // Public readonly signal for components to subscribe to
  theme = this._theme.asReadonly();

  constructor() {
    this.initializeTheme();
  }

  private initializeTheme() {
    const savedTheme = localStorage.getItem(this.THEME_KEY) as 'light' | 'dark' | 'system';

    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      this._theme.set(savedTheme);
    }
    this.applyTheme();
  }

  private async applyTheme() {
    if (this.isViewTransitionsSupported()) {
      await document.startViewTransition(() => {
        this.updateThemeClass();
      }).finished;
    } else {
      this.updateThemeClass();
    }
  }

  private updateThemeClass() {
    document.body.classList.remove('light', 'dark', 'system');
    document.body.classList.add(this._theme());
  }

  async setTheme(theme: themeOptions) {
    if (this._theme() === theme) return;

    this._theme.set(theme);
    localStorage.setItem(this.THEME_KEY, theme);
    await this.applyTheme();
  }

  getTheme() {
    return this._theme();
  }

  async turnOnLightTheme() {
    await this.setTheme('light');
  }

  async turnOnDarkTheme() {
    await this.setTheme('dark');
  }

  async turnOnSystemTheme() {
    await this.setTheme('system');
  }

  isViewTransitionsSupported(): boolean {
    return 'startViewTransition' in document;
  }
}
