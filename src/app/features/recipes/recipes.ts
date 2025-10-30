import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import RecipeListService from './services/recipe-list.service';

@Component({
  selector: 'app-recipes',
  imports: [RouterModule],
  templateUrl: './recipes.html',
  providers: [RecipeListService],
})
export class Recipes {}
