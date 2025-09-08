import { Component } from '@angular/core';
import { RecipesList } from './recipes-list/recipes-list';

@Component({
  selector: 'app-recipes',
  imports: [RecipesList],
  templateUrl: './recipes.html',
  styleUrl: './recipes.css',
})
export class Recipes {}
