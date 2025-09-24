import { Component } from '@angular/core';
import { MainLayout } from '../../shared/layout/main-layout/main-layout';
import { RouterModule } from '@angular/router';
import RecipeListService from './services/recipe-list.service';
import { RecipeItemService } from './services/recipe-item.service';

@Component({
  selector: 'app-recipes',
  imports: [MainLayout, RouterModule],
  templateUrl: './recipes.html',
  styleUrl: './recipes.css',
  providers: [RecipeListService, RecipeItemService],
})
export class Recipes {}
