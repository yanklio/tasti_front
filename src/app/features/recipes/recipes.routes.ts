import { Routes } from '@angular/router';
import { Recipes } from './recipes';
import { ManageRecipe } from './manage-recipe/manage-recipe';
import { RECIPES_ROUTES } from './constants';
import { RecipesList } from './recipes-list/recipes-list';
import { RecipeItem } from './recipe-item/recipe-item';

export const recipesRoutes: Routes = [
  {
    path: '',
    component: Recipes,
    children: [
      {
        path: RECIPES_ROUTES.RECIPES_LIST,
        component: RecipesList,
        title: 'Recipes',
      },
      {
        path: RECIPES_ROUTES.CREATE_RECIPE,
        component: ManageRecipe,
        title: 'Create Recipe',
        data: { mode: 'create' },
      },
      {
        path: RECIPES_ROUTES.EDIT_RECIPE + '/:id',
        component: ManageRecipe,
        title: 'Edit Recipe',
        data: { mode: 'edit' },
      },
      {
        path: ':id',
        component: RecipeItem,
        title: 'Recipe Detail',
      },
    ],
  },
];
