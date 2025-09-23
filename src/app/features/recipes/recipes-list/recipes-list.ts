import { Component, inject } from '@angular/core';
import { RecipesCard } from '../recipes-card/recipes-card';
import RecipesService from '../recipes.service';
import { Recipe } from '../recipe.model';
import { ResourceState } from '../../../core/interfaces/resource-state';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { RECIPES_ROUTES } from '../constants';
import { LoaderComponent } from '../../../shared/loader/loader';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.html',
  styleUrl: './recipes-list.css',
  imports: [RecipesCard, MatButtonModule, MatIconModule, LoaderComponent],
})
export class RecipesList {
  router = inject(Router);
  recipesService = inject(RecipesService);

  resource: ResourceState<Recipe[]> = { data: null, loading: true, error: null };

  recipes: Recipe[] | null = this.resource.data;
  loading = this.resource.loading;
  error = this.resource.error;

  constructor() {
    // this.resource = this.recipesService.getRecipes();
  }

  onCreateRecipe() {
    this.router.navigate([RECIPES_ROUTES.CREATE_RECIPE]);
  }
}
