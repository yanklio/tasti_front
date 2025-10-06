import { Component, inject } from '@angular/core';
import { BackHeader } from '../../shared/components/back-header/back-header';
import { MainLayout } from '../../shared/layout/main-layout/main-layout';
import { ThemeService } from '../../core/services/theme.service';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-settings',
  imports: [BackHeader, MainLayout, MatButtonToggleModule, MatCard, MatIcon],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  readonly themeService = inject(ThemeService);

  onBackClick() {
    window.history.back();
  }

  onThemeChange(event: MatButtonToggleChange): void {
    const theme = event.value;

    switch (theme) {
      case 'light':
        this.themeService.turnOnLightTheme();
        break;
      case 'dark':
        this.themeService.turnOnDarkTheme();
        break;
      case 'system':
        this.themeService.turnOnSystemTheme();
        break;
    }
  }
}
