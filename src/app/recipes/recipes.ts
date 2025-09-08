import { Component } from '@angular/core';
import { RecipesList } from './recipes-list/recipes-list';
import RecipesService from './recipes.service';

@Component({
  selector: 'app-recipes',
  imports: [RecipesList],
  templateUrl: './recipes.html',
  styleUrl: './recipes.css',
  providers: [RecipesService],
})
export class Recipes {}
