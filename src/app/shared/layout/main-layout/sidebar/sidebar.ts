import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule, MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { ThemeService } from '../../../../core/services/theme.service';
import { LogoComponent } from '../../../components/logo/logo';
import { SessionService } from '../../../../core/services/session.service';

@Component({
  selector: 'app-sidebar',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatMenuModule,
    LogoComponent,
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  router = inject(Router);

  themeService = inject(ThemeService);
  sessionService = inject(SessionService);

  onAuthButtonClick() {
    if (this.sessionService.isAuthenticated()) {
      // TODO: Implement account page navigation
      // this.router.navigate(['/account']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

  getAuthButtonIcon(): string {
    return this.sessionService.isAuthenticated() ? 'account_circle' : 'login';
  }

  getAuthButtonTooltip(): string {
    return this.sessionService.isAuthenticated() ? 'Account' : 'Login';
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
