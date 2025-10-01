import { ChangeDetectionStrategy, Component, input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Recipe, RecipeBrief } from '../../recipe.model';
import { RECIPES_ROUTES } from '../../constants';
import { GLOBAL_ROUTES } from '../../../../constants';
import { UsernamePipe } from '../../../../core/pipes/username-pipe';

@Component({
  selector: 'app-recipes-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule, UsernamePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './recipes-card.html',
  styleUrl: './recipes-card.css',
})
export class RecipesCard {
  recipe = input.required<RecipeBrief>();
  private router = inject(Router);

  onViewDetails() {
    this.router.navigate([GLOBAL_ROUTES.RECIPES, this.recipe().id]);
  }

  onEdit() {
    this.router.navigate([GLOBAL_ROUTES.RECIPES, RECIPES_ROUTES.EDIT_RECIPE, this.recipe().id]);
  }
}
