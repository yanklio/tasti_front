import { Login } from './login/login';
import { Register } from './register/register';
import { Auth } from './auth';
import { Route } from '@angular/router';

export const authRoutes: Route[] = [
  {
    path: '',
    component: Auth,
    children: [
      {
        path: 'login',
        component: Login,
      },
      {
        path: 'register',
        component: Register,
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'login',
      },
    ],
  },
];
