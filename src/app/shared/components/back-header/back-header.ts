import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-back-header',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './back-header.html',
  styleUrl: './back-header.css',
})
export class BackHeader {
  readonly title = input<string>('');
  readonly backgroundColor = input<string>('var(--mat-sys-surface-container-low)');
  readonly padding = input<string>('0');
  readonly backClick = output<void>();
}
