import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Recipe } from '../../features/recipes/recipe.model';

@Component({
  selector: 'app-recipes-card',
  imports: [MatCardModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './recipes-card.html',
  styleUrl: './recipes-card.css',
})
export class RecipesCard {
  recipe = input.required<Recipe>();
}
