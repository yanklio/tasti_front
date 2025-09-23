import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { ResourceState } from '../../core/interfaces/resource-state';

// TODO: Send a HTTP requests to get recipes
@Injectable({
  providedIn: 'root'
})
export default class RecipesService {
  private recipesState: ResourceState<Recipe[]> = {
    data: [
      {
        id: 1,
        title: 'Schnitzel',
        description: 'A delicious Austrian dish made with breaded and fried pork cutlets.',
        imageUrl:
          'https://thestayathomechef.com/wp-content/uploads/2024/04/Authentic-German-Schnitzel_Square-2.jpg',
        ingredients: [],
      },
      {
        id: 2,
        title: 'Spaghetti',
        description: 'A classic Italian dish made with long, thin pasta and a variety of sauces.',
        imageUrl:
          'https://www.simplyrecipes.com/thmb/K54cPz_L-7C6csildu5TVbexEGY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/simply-recipes-creole-spaghetti-lead-3-3dea2465b8ee46458f5bcfa6e936af72.jpg',
        ingredients: [],
      },
      {
        id: 3,
        title: 'Pizza',
        description:
          'A popular Italian dish made with dough, tomato sauce, cheese, and various toppings.',
        imageUrl:
          'https://assets.surlatable.com/m/15a89c2d9c6c1345/72_dpi_webp-REC-283110_Pizza.jpg',
        ingredients: [],
      },
      {
        id: 4,
        title: 'Lasagna',
        description: 'A classic Italian dish made with layers of pasta, cheese, and meat sauce.',
        imageUrl:
          'https://thestayathomechef.com/wp-content/uploads/2024/03/Most-Amazing-Lasagna_Square-2-1200x752.jpg',
        ingredients: [],
      },
      {
        id: 5,
        title: 'Tacos',
        description: 'A traditional Mexican dish consisting of a folded or rolled tortilla filled with various mixtures.',
        imageUrl:
          'https://danosseasoning.com/wp-content/uploads/2022/03/Beef-Tacos-1024x767.jpg',
        ingredients: [],
      },
      {
        id: 6,
        title: 'Burrito',
        description: 'A Mexican dish consisting of a flour tortilla wrapped around a filling, typically of beans or ground or shredded beef.',
        imageUrl: 
          'https://www.marthastewart.com/thmb/uSaztTRX13520w0w-inW35pDZ0s=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/MS-312932-bean-burritos-hero-7421-0096cb35178e4650b4b65012e0e7b699.jpg',
        ingredients: [],
      },
    ],
    loading: false,
    error: null
  };

  constructor() {}

  getRecipes(): ResourceState<Recipe[]> {
    return this.recipesState;
  }

  getRecipe(id: number): ResourceState<Recipe> {
    const recipe = this.recipesState.data?.find((recipe: Recipe) => recipe.id === id) || null;
    return {
      data: recipe,
      loading: false,
      error: null
    };
  }

  updateRecipe(updatedRecipe: Recipe) {
    if (this.recipesState.data) {
      const index = this.recipesState.data.findIndex((recipe: Recipe) => recipe.id === updatedRecipe.id);
      if (index !== -1) {
        this.recipesState.data[index] = updatedRecipe;
      }
    }
  }

  addRecipe(recipe: Recipe) {
    recipe.id = Date.now();
    this.recipesState.data?.push(recipe);
  }
}
