import { Component, inject, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';
import { FaviconService } from './core/services/favicon.service';
import { SessionService } from './core/services/session.service';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbarModule, MatDialogModule],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('tasti_front');

  theme = inject(ThemeService);
  favicon = inject(FaviconService);

  session = inject(SessionService);

  constructor() {
    this.favicon.setFaviconByTheme(
      'assets/favicons/favicon-light.ico',
      'assets/favicons/favicon-dark.ico',
    );
  }
}
