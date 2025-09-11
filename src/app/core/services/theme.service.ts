import { Injectable } from '@angular/core';

type themeOptions = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private theme: themeOptions = 'system';
  private readonly THEME_KEY = 'app-theme';

  constructor() {
    this.initializeTheme();
  }

  private initializeTheme() {
    const savedTheme = localStorage.getItem(this.THEME_KEY) as 'light' | 'dark' | 'system';

    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      this.theme = savedTheme;
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
    document.body.classList.add(this.theme);
  }

  async setTheme(theme: themeOptions) {
    if (this.theme === theme) return;

    this.theme = theme;
    localStorage.setItem(this.THEME_KEY, theme);
    await this.applyTheme();
  }

  getTheme() {
    return this.theme;
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

  getCurrentTheme() {
    return this.theme;
  }

  isViewTransitionsSupported(): boolean {
    return 'startViewTransition' in document;
  }
}
