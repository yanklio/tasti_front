import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, ActivatedRoute } from '@angular/router';
import { RECIPES_ROUTES } from '../constants';
import RecipeListService from '../services/recipe-list.service';
import { RecipesCard } from './recipes-card/recipes-card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { LoaderComponent } from '../../../shared/components/loader/loader';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { SuggestAuth } from '../../../core/directives/suggest-auth';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.html',
  styleUrl: './recipes-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RecipesCard,
    MatButtonModule,
    MatIconModule,
    LoaderComponent,
    MatPaginatorModule,
    EmptyState,
    SuggestAuth,
  ],
})
export class RecipesList {
  router = inject(Router);
  route = inject(ActivatedRoute);
  recipeListService = inject(RecipeListService);

  recipes = this.recipeListService.recipes;
  loading = this.recipeListService.loading;
  error = this.recipeListService.error;

  pagination = this.recipeListService.pagination;

  constructor() {
    this.route.queryParams.subscribe((params) => {
      const current_page = +params['current_page'] || 1;
      const page_size = +params['page_size'] || 10;
      this.recipeListService.getRecipes({ page: current_page, pageSize: page_size }).subscribe();
    });
  }

  onPageChange(event: PageEvent) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { current_page: event.pageIndex + 1, page_size: event.pageSize },
      queryParamsHandling: 'merge',
    });
  }

  onCreateRecipe() {
    this.router.navigate([RECIPES_ROUTES.CREATE_RECIPE]);
  }
}
