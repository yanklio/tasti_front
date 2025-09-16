import { Routes } from '@angular/router';
import { Recipes } from './features/recipes/recipes';
import { ManageRecipe } from './features/recipes/manage-recipe/manage-recipe';

export const routes: Routes = [
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
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
    title: 'Authentication',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
