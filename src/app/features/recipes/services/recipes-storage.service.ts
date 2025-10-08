import { inject, Injectable, InjectionToken, PLATFORM_ID } from '@angular/core';
import { of } from 'rxjs';
import { Recipe, RecipeBrief } from '../recipe.model';

export const LOCAL_STORAGE = new InjectionToken<Storage>('window local storage object', {
  providedIn: 'root',
  factory: () => {
    return inject(PLATFORM_ID) === 'browser' ? window.localStorage : ({} as Storage);
  },
});
@Injectable({
  providedIn: 'root',
})
export class RecipesStorageService {
  storage = inject(LOCAL_STORAGE);

  loadBriefRecipes() {
    const recipes = this.storage.getItem('recipes-brief');
    return of(recipes ? JSON.parse(recipes) : []);
  }

  saveBriefRecipes(recipes: RecipeBrief[]) {
    this.storage.setItem('recipes-brief', JSON.stringify(recipes));
  }

  loadRecipes() {
    const recipes = this.storage.getItem('recipes');
    return of(recipes ? JSON.parse(recipes) : []);
  }

  saveRecipes(recipes: Recipe[]) {
    this.storage.setItem('recipes', JSON.stringify(recipes));
  }
}
