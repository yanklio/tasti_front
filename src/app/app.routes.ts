import { Routes } from '@angular/router';
import { Recipes } from './features/recipes/recipes';
import { Auth } from './features/auth/auth';

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
