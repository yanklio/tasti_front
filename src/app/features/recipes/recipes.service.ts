import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';

@Injectable()
export default class RecipesService {
  constructor() {}

  getRecipes() {
    return [
      {
        id: 1,
        title: 'Schnitzel',
        description: 'A delicious Austrian dish made with breaded and fried pork cutlets.',
        imageUrl:
          'https://thestayathomechef.com/wp-content/uploads/2024/04/Authentic-German-Schnitzel_Square-2.jpg',
      },
      {
        id: 2,
        title: 'Spaghetti',
        description: 'A classic Italian dish made with long, thin pasta and a variety of sauces.',
        imageUrl:
          'https://www.simplyrecipes.com/thmb/K54cPz_L-7C6csildu5TVbexEGY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/simply-recipes-creole-spaghetti-lead-3-3dea2465b8ee46458f5bcfa6e936af72.jpg',
      },
      {
        id: 3,
        title: 'Pizza',
        description:
          'A popular Italian dish made with dough, tomato sauce, cheese, and various toppings.',
        imageUrl:
          'https://assets.surlatable.com/m/15a89c2d9c6c1345/72_dpi_webp-REC-283110_Pizza.jpg',
      },
      {
        id: 4,
        title: 'Lasagna',
        description: 'A classic Italian dish made with layers of pasta, cheese, and meat sauce.',
        imageUrl:
          'https://thestayathomechef.com/wp-content/uploads/2024/03/Most-Amazing-Lasagna_Square-2-1200x752.jpg',
      },
    ] as Recipe[];
  }
}
