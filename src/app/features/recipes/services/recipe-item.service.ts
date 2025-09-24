import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { RECIPES_API_ENDPOINTS } from '../constants';
import { Recipe } from '../recipe.model';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable()
export class RecipeItemService {
  private http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl + RECIPES_API_ENDPOINTS.BASE + '/';

  private _currentRecipe = signal<Recipe | null>(null);
  private _loading = signal(false);
  private _error = signal<string | null>(null);

  readonly currentRecipe = this._currentRecipe.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly state = {
    recipes: this.currentRecipe,
    loading: this.loading,
    error: this.error,
  };

  clearCurrentRecipe() {
    this._currentRecipe.set(null);
  }

  loadRecipeById(id: number): Observable<Recipe> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.get<Recipe>(this.apiUrl + id + '/').pipe(
      tap((recipe) => {
        this._currentRecipe.set(recipe);
        this._loading.set(false);
      }),
      catchError((error) => {
        this._error.set(error.message);
        this._loading.set(false);
        return throwError(() => error);
      }),
    );
  }

  addRecipe(recipe: Recipe): Observable<Recipe> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.post<Recipe>(this.apiUrl, recipe).pipe(
      tap((recipe) => {
        this._currentRecipe.set(recipe);
        this._loading.set(false);
      }),
      catchError((error) => {
        this._error.set(error.message);
        this._loading.set(false);
        return throwError(() => error);
      }),
    );
  }

  editRecipe(
    recipe: Recipe,
    onSuccess?: () => void,
    onError?: (error: any) => void,
  ): Observable<Recipe> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.put<Recipe>(this.apiUrl + recipe.id + '/', recipe).pipe(
      tap((recipe) => {
        this._currentRecipe.set(recipe);
        this._loading.set(false);
        if (onSuccess) onSuccess();
      }),
      catchError((error) => {
        this._error.set(error.message);
        this._loading.set(false);
        if (onError) onError(error);
        return throwError(() => error);
      }),
    );
  }

  deleteRecipe(
    id: number,
    onSuccess?: () => void,
    onError?: (error: any) => void,
  ): Observable<void> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.delete<void>(this.apiUrl + id + '/').pipe(
      tap(() => {
        this._currentRecipe.set(null);
        this._loading.set(false);
        if (onSuccess) onSuccess();
      }),
      catchError((error) => {
        this._error.set(error.message);
        this._loading.set(false);
        if (onError) onError(error);
        return throwError(() => error);
      }),
    );
  }
}
