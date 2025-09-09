import { Component } from '@angular/core';
import { RecipesList } from './recipes-list/recipes-list';
import RecipesService from './recipes.service';
import { MainLayout } from '../../shared/layout/main-layout/main-layout';

@Component({
  selector: 'app-recipes',
  imports: [RecipesList, MainLayout],
  templateUrl: './recipes.html',
  styleUrl: './recipes.css',
  providers: [RecipesService],
})
export class Recipes {}
