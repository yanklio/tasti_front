import { Component, inject } from '@angular/core';
import { RecipesCard } from '../recipes-card/recipes-card';
import { Recipe } from '../recipe.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { RECIPES_ROUTES } from '../constants';
import { LoaderComponent } from '../../../shared/loader/loader';
import RecipeListService from '../services/recipe-list.service';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.html',
  styleUrl: './recipes-list.css',
  imports: [RecipesCard, MatButtonModule, MatIconModule, LoaderComponent],
})
export class RecipesList {
  router = inject(Router);
  recipeListService = inject(RecipeListService);

  recipes = this.recipeListService.recipes;
  loading = this.recipeListService.loading;
  error = this.recipeListService.error;

  onCreateRecipe() {
    this.router.navigate([RECIPES_ROUTES.CREATE_RECIPE]);
  }
}
