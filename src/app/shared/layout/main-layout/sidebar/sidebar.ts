import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { ThemeService } from '../../../../core/services/theme.service';
import { LogoComponent } from '../../../components/logo/logo';
import { Router } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [MatIconModule, MatButtonModule, MatTooltipModule, MatMenuModule, LogoComponent],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  router = inject(Router);

  themeService = inject(ThemeService);
  userService = inject(UserService);
  authService = inject(AuthService);

  onAuthButtonClick() {
    if (this.userService.isLoggedIn()) {
      // TODO: Implement account page navigation
      // this.router.navigate(['/account']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

  getAuthButtonIcon(): string {
    return this.userService.isLoggedIn() ? 'account_circle' : 'login';
  }

  getAuthButtonTooltip(): string {
    return this.userService.isLoggedIn() ? 'Account' : 'Login';
  }
}
