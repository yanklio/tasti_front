import { Component, inject } from '@angular/core';
import { RecipesCard } from '../recipes-card/recipes-card';
import RecipesService from '../recipes.service';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.html',
  styleUrl: './recipes-list.css',
  imports: [RecipesCard],
})
export class RecipesList {
  recipesService = inject(RecipesService);

  recipes: Recipe[] = [];

  constructor() {
    this.recipes = this.recipesService.getRecipes();
  }
}
