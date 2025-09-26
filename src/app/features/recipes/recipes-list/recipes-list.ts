import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { RECIPES_ROUTES } from '../constants';
import { LoaderComponent } from '../../../shared/components/loader/loader';
import RecipeListService from '../services/recipe-list.service';
import { RecipesCard } from './recipes-card/recipes-card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { AuthRequired } from '../../../core/directives/auth-required';


@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.html',
  styleUrl: './recipes-list.css',
  standalone: true,
  imports: [RecipesCard, MatButtonModule, MatIconModule, LoaderComponent, MatPaginatorModule, EmptyState, AuthRequired],
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
