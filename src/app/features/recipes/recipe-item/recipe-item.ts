import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RecipeItemService } from '../services/recipe-item.service';
import { LoaderComponent } from '../../../shared/components/loader/loader';
import { Subscription } from 'rxjs';
import { RECIPES_ROUTES } from '../constants';
import { GLOBAL_ROUTES } from '../../../constants';

@Component({
  selector: 'app-recipe-item',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, RouterModule, LoaderComponent],
  templateUrl: './recipe-item.html',
  styleUrl: './recipe-item.css',
})
export class RecipeItem {
  private recipeService = inject(RecipeItemService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private subscription: Subscription | null = null;

  // Using signals from the service directly
  readonly recipe = this.recipeService.currentRecipe;
  readonly loading = this.recipeService.loading;
  readonly error = this.recipeService.error;

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id)) {
      this.subscription = this.recipeService.loadRecipeById(id).subscribe();
    }
  }

  onBack(): void {
    this.router.navigate([RECIPES_ROUTES.RECIPES_LIST]);
  }

  onEditRecipe(): void {
    const recipe = this.recipe();
    if (recipe) {
      this.router.navigate([RECIPES_ROUTES.EDIT_RECIPE, recipe.id]);
    }
  }
}
