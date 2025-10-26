import { Component } from '@angular/core';
import { MainLayout } from '../../shared/layout/main-layout/main-layout';
import { RouterModule } from '@angular/router';
import RecipeListService from './services/recipe-list.service';

@Component({
  selector: 'app-recipes',
  imports: [MainLayout, RouterModule],
  templateUrl: './recipes.html',
  providers: [RecipeListService],
})
export class Recipes {}
