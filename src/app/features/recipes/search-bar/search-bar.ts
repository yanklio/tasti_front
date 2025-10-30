import { Component, signal, output, ChangeDetectionStrategy } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-bar',
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule],
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBar {
  searchTerm = signal('');
  search = output<string>();

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    this.search.emit(value);
  }

  onIconClick() {
    if (this.searchTerm()) {
      this.searchTerm.set('');
      this.search.emit('');
    }
  }
}
