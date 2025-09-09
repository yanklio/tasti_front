import { Routes } from '@angular/router';
import { Recipes } from './recipes/recipes';
import { Auth } from './auth/auth';

export const routes: Routes = [
    {
        path: '',
        component: Recipes,
        title: 'Recipes',
    },
    {
        path: 'auth',
        component: Auth,
        title: 'Authentication',
    }
];
