import { Routes } from '@angular/router';
import { Recipes } from './recipes';
import { ManageRecipe } from './manage-recipe/manage-recipe';
import { RECIPES_ROUTES } from './constants';

export const recipesRoutes: Routes = [
  {
    path: RECIPES_ROUTES.RECIPES_LIST,
    component: Recipes,
    title: 'Recipes',
  },
  {
    path: RECIPES_ROUTES.CREATE_RECIPE,
    component: ManageRecipe,
    title: 'Create Recipe',
    data: { mode: 'create' }
  },
  {
    path: RECIPES_ROUTES.EDIT_RECIPE,
    component: ManageRecipe,
    title: 'Edit Recipe',
    data: { mode: 'edit' }
  },
];
