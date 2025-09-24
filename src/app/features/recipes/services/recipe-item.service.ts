import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RECIPES_API_ENDPOINTS } from '../constants';
import { Recipe } from '../recipe.model';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class RecipeItemService {
  private http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl + RECIPES_API_ENDPOINTS.BASE;

  private _currentRecipe = signal<Recipe | null>(null);
  private _loading = signal(true);
  private _error = signal<string | null>(null);

  readonly currentRecipe = this._currentRecipe.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly state = {
    recipes: this.currentRecipe,
    loading: this.loading,
    error: this.error,
  };

  loadRecipeById(id: number): void {
    this._loading.set(true);
    this._error.set(null);

    this.http.get<Recipe>(this.apiUrl + id + '/').subscribe({
      next: (recipe) => {
        this._currentRecipe.set(recipe);
        this._loading.set(false);
      },
      error: (error) => {
        this._error.set(error.message);
        this._loading.set(false);
      },
    });
  }

  addRecipe(recipe: Recipe, onSuccess?: () => void, onError?: (error: any) => void): void {
    this._loading.set(true);
    this._error.set(null);

    this.http.post<Recipe>(this.apiUrl, recipe).subscribe({
      next: (recipe) => {
        this._currentRecipe.set(recipe);
        this._loading.set(false);
        if (onSuccess) onSuccess();
      },
      error: (error) => {
        this._error.set(error.message);
        this._loading.set(false);
        if (onError) onError(error);
      },
    });
  }

  editRecipe(recipe: Recipe, onSuccess?: () => void, onError?: (error: any) => void): void {
    this._loading.set(true);
    this._error.set(null);

    this.http.put<Recipe>(this.apiUrl + recipe.id + '/', recipe).subscribe({
      next: (recipe) => {
        this._currentRecipe.set(recipe);
        this._loading.set(false);
        if (onSuccess) onSuccess();
      },
      error: (error) => {
        this._error.set(error.message);
        this._loading.set(false);
        if (onError) onError(error);
      },
    });
  }

  deleteRecipe(id: number, onSuccess?: () => void, onError?: (error: any) => void): void {
    this._loading.set(true);
    this._error.set(null);

    this.http.delete<void>(this.apiUrl + id + '/').subscribe({
      next: () => {
        this._currentRecipe.set(null);
        this._loading.set(false);
        if (onSuccess) onSuccess();
      },
      error: (error) => {
        this._error.set(error.message);
        this._loading.set(false);
        if (onError) onError(error);
      },
    });
  }
}
