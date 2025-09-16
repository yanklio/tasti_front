import { Routes } from '@angular/router';
import { Recipes } from './features/recipes/recipes';
import { CreateRecipe } from './features/recipes/create-recipe/create-recipe';
import { EditRecipe } from './features/recipes/edit-recipe/edit-recipe';

export const routes: Routes = [
  {
    path: '',
    component: Recipes,
    title: 'Recipes',
  },
  {
    path: 'create-recipe',
    component: CreateRecipe,
    title: 'Create Recipe',
  },
  {
    path: 'edit-recipe/:id',
    component: EditRecipe,
    title: 'Edit Recipe',
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
