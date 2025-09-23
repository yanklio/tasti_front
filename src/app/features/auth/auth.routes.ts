import { Login } from './login/login';
import { Register } from './register/register';
import { Auth } from './auth';
import { Route } from '@angular/router';
import { AUTH_ROUTES } from './constants';

export const authRoutes: Route[] = [
  {
    path: '',
    component: Auth,
    children: [
      {
        path: AUTH_ROUTES.LOGIN,
        component: Login,
        title: 'Login',
      },
      {
        path: AUTH_ROUTES.REGISTER,
        component: Register,
        title: 'Register',
      },
      {
        path: '',
        redirectTo: AUTH_ROUTES.DEFAULT,
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: AUTH_ROUTES.DEFAULT,
      },
    ],
  },
];
