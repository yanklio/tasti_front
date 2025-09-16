import { Component } from '@angular/core';
import { RecipesList } from './recipes-list/recipes-list';
import { MainLayout } from '../../shared/layout/main-layout/main-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-recipes',
  imports: [RecipesList, MainLayout, MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './recipes.html',
  styleUrl: './recipes.css',
})
export class Recipes {
  constructor(private router: Router) {}

  onCreateRecipe() {
    this.router.navigate(['/create-recipe']);
  }
}