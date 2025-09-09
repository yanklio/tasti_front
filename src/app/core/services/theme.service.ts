import { Injectable } from "@angular/core";

type themeOptions = 'light' | 'dark' | 'system';

@Injectable({
    providedIn: 'root'
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

    private applyTheme() {
        document.body.classList.remove('light', 'dark', 'system');
        
        if (this.theme === 'system') {
            document.body.classList.add('system');
        } else {
            document.body.classList.add(this.theme);
        }
    }

    setTheme(theme: themeOptions) {
        if (this.theme === theme) return;

        this.theme = theme;
        localStorage.setItem(this.THEME_KEY, theme);
        this.applyTheme();
    }

    getTheme() {
        return this.theme;
    }

    turnOnLightTheme() {
        this.setTheme('light');
    }

    turnOnDarkTheme() {
        this.setTheme('dark');
    }

    turnOnSystemTheme() {
        this.setTheme('system');
    }

    getCurrentTheme() {
        return this.theme;
    }
}