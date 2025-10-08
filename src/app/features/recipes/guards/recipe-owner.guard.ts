import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { RecipeItemService } from '../services/recipe-item.service';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

export const recipeOwnerGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const recipeService = inject(RecipeItemService);
  const router = inject(Router);

  const id = +route.paramMap.get('id')!;

  const currentRecipe = recipeService.recipe();
  if (currentRecipe && currentRecipe.id === id) {
    return of(recipeService.isOwner() ? true : router.createUrlTree(['/']));
  } else {
    return recipeService.loadRecipeById(id).pipe(
      map(() => {
        if (recipeService.isOwner()) {
          return true;
        } else {
          return router.createUrlTree(['/']);
        }
      }),
    );
  }
};
