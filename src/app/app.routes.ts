import { Routes } from '@angular/router';
import { GLOBAL_ROUTES } from './constants';
import { Settings } from './features/settings/settings';
import { Account } from './features/account/account';
import { MainShell } from './shared/layout/main-shell/main-shell';

export const routes: Routes = [
  {
    path: '',
    component: MainShell,
    children: [
      {
        path: GLOBAL_ROUTES.SETTINGS,
        component: Settings,
        title: 'Settings',
      },
      {
        path: GLOBAL_ROUTES.ACCOUNT,
        component: Account,
        title: 'Account',
      },
      {
        path: GLOBAL_ROUTES.RECIPES,
        loadChildren: () =>
          import('./features/recipes/recipes.routes').then((m) => m.recipesRoutes),
      },
      {
        path: '',
        redirectTo: GLOBAL_ROUTES.RECIPES,
        pathMatch: 'full',
      },
    ],
  },
  {
    path: GLOBAL_ROUTES.AUTH,
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
    title: 'Authentication',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
