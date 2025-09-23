import { Routes } from '@angular/router';
import { Recipes } from './recipes';
import { ManageRecipe } from './manage-recipe/manage-recipe';

export const recipesRoutes: Routes = [
  {
    path: '',
    component: Recipes,
    title: 'Recipes',
  },
  {
    path: 'create-recipe',
    component: ManageRecipe,
    title: 'Create Recipe',
    data: { mode: 'create' }
  },
  {
    path: 'edit-recipe/:id',
    component: ManageRecipe,
    title: 'Edit Recipe',
    data: { mode: 'edit' }
  },
];
