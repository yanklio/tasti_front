import { Component } from '@angular/core';
import { MainLayout } from '../../shared/layout/main-layout/main-layout';
import { RouterModule } from '@angular/router';
import RecipesService from './recipes.service';

@Component({
  selector: 'app-recipes',
  imports: [MainLayout, RouterModule],
  templateUrl: './recipes.html',
  styleUrl: './recipes.css',
  providers: [RecipesService],
})
export class Recipes {
}
