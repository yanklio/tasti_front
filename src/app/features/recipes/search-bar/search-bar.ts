import { Component, signal, inject, ChangeDetectionStrategy, effect } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import RecipeListService from '../services/recipe-list.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBar {
  private readonly recipeListService = inject(RecipeListService);

  readonly searchTermSignal = signal<string>('');
  readonly searchTerm = new FormControl<string>('');

  constructor() {
    effect(() => {
      this.searchTerm.valueChanges
        .pipe(debounceTime(500), distinctUntilChanged())
        .subscribe((res) => {
          this.searchTermSignal.set(res || '');
          console.log('Performing search for:', res);
        });
    });
  }

  onIconClick() {
    if (this.searchTermSignal()) {
      this.searchTerm.setValue('');
    }
  }
}
