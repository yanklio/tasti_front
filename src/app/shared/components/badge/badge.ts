import { Component, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [MatChipsModule],
  template: ` <mat-chip class="badge">{{ text() }}</mat-chip> `,
  styleUrl: './badge.css',
})
export class BadgeComponent {
  text = input<string>('BETA');
}
