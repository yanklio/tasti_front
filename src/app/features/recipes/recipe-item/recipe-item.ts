import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RecipeItemService } from '../services/recipe-item.service';
import { LoaderComponent } from '../../../shared/components/loader/loader';
import { BackHeader } from '../../../shared/components/back-header/back-header';
import { UsernamePipe } from '../../../core/pipes/username-pipe';
import { RECIPES_ROUTES } from '../constants';

@Component({
  selector: 'app-recipe-item',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    LoaderComponent,
    BackHeader,
    UsernamePipe,
  ],
  templateUrl: './recipe-item.html',
  styleUrl: './recipe-item.css',
})
export class RecipeItem {
  private readonly recipeService = inject(RecipeItemService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // Using signals from the service directly
  readonly recipe = this.recipeService.recipe;
  readonly loading = this.recipeService.loading;
  readonly error = this.recipeService.error;

  readonly isOwner = this.recipeService.isOwner;

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.recipeService.loadRecipeById(id).subscribe();
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
