import { Component, inject } from '@angular/core';
import { MainLayout } from '../../shared/layout/main-layout/main-layout';
import { BackHeader } from '../../shared/components/back-header/back-header';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-account',
  imports: [MainLayout, BackHeader, MatCardModule, MatButtonToggleModule],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account {
  private readonly userService = inject(UserService);

  readonly user = this.userService.user;

  onBackClick() {
    window.history.back();
  }
}
