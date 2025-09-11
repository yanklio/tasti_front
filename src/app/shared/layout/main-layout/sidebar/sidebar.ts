import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { ThemeService } from '../../../../core/services/theme.service';
import { LogoComponent } from '../../../components/logo/logo';

@Component({
  selector: 'app-sidebar',
  imports: [MatIconModule, MatButtonModule, MatTooltipModule, MatMenuModule, LogoComponent],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  themeService = inject(ThemeService);
}
