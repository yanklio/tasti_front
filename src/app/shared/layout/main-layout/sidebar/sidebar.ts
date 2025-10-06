import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { LogoComponent } from '../../../components/logo/logo';
import { BadgeComponent } from '../../../components/badge/badge';
import { SessionService } from '../../../../core/services/session.service';
import { AUTH_API_ENDPOINTS } from '../../../../core/constants';
import { GLOBAL_ROUTES } from '../../../../constants';

@Component({
  selector: 'app-sidebar',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    LogoComponent,
    BadgeComponent,
    RouterLink,
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  router = inject(Router);

  sessionService = inject(SessionService);

  readonly settingsRoute = GLOBAL_ROUTES.SETTINGS;

  onAuthButtonClick() {
    if (this.sessionService.isAuthenticated()) {
      // TODO: Implement account page navigation
      // this.router.navigate(['/account']);
    } else {
      this.router.navigate([AUTH_API_ENDPOINTS.BASE + AUTH_API_ENDPOINTS.LOGIN]);
    }
  }

  getAuthButtonIcon(): string {
    return this.sessionService.isAuthenticated() ? 'account_circle' : 'login';
  }

  getAuthButtonTooltip(): string {
    return this.sessionService.isAuthenticated() ? 'Account' : 'Login';
  }
}
