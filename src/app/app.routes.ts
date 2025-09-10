import { Routes } from '@angular/router';
import { Recipes } from './features/recipes/recipes';

export const routes: Routes = [
  {
    path: '',
    component: Recipes,
    title: 'Recipes',
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
