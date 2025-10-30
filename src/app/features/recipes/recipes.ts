import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import RecipeListService from './services/recipe-list.service';
import { SearchBar } from './search-bar/search-bar';

@Component({
  selector: 'app-recipes',
  imports: [RouterModule, SearchBar],
  templateUrl: './recipes.html',
  styleUrls: ['./recipes.css'],
  providers: [RecipeListService],
})
export class Recipes {}
