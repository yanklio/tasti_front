import { ChangeDetectionStrategy, Component, input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Recipe } from '../../recipe.model';

@Component({
  selector: 'app-recipes-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './recipes-card.html',
  styleUrl: './recipes-card.css',
})
export class RecipesCard {
  recipe = input.required<Recipe>();
  private router = inject(Router);

  onEdit() {
    this.router.navigate(['/edit-recipe', this.recipe().id]);
  }
}
