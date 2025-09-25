import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.css',
  standalone: true,
  imports: [MatIconModule],
})
export class EmptyState {
  text = input<string>('Default empty state text');
  textSize = input<number>(24);

  icon = input<string | null>(null);
  iconSize = input<number>(80);
}
