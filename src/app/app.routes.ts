import { Routes } from '@angular/router';
import { GLOBAL_ROUTES } from './constants';
import { Settings } from './features/settings/settings';

export const routes: Routes = [
  {
    path: GLOBAL_ROUTES.SETTINGS,
    component: Settings,
    title: 'Settings',
  },
  {
    path: GLOBAL_ROUTES.RECIPES,
    loadChildren: () => import('./features/recipes/recipes.routes').then((m) => m.recipesRoutes),
  },
  {
    path: GLOBAL_ROUTES.AUTH,
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
    title: 'Authentication',
  },
  {
    path: '**',
    redirectTo: GLOBAL_ROUTES.HOME,
  },
];
