import { inject, Injectable, signal } from '@angular/core';
import { RecipeBrief } from '../recipe.model';
import { environment } from '../../../../environments/environment';
import { RECIPES_API_ENDPOINTS, RECIPES_ROUTES } from '../constants';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { PaginatedResponse } from '../../../core/models/paginated-response';

// TODO: Send a HTTP requests to get recipes
@Injectable()
export default class RecipeListService {
  private http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl + RECIPES_API_ENDPOINTS.BASE + '/';

  private _recipes = signal<RecipeBrief[]>([]);
  private _loading = signal(true);
  private _error = signal<string | null>(null);

  readonly recipes = this._recipes.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly state = {
    recipes: this.recipes,
    loading: this.loading,
    error: this.error,
  };

  constructor() {
    this.loadRecipes().subscribe();
  }

  loadRecipes(): Observable<PaginatedResponse<RecipeBrief>> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.get<PaginatedResponse<RecipeBrief>>(this.apiUrl).pipe(
      tap((response) => {
        const transformedRecipes =
          response.results?.map(
            (apiRecipe: any) =>
              ({
                ...apiRecipe,
                createAt: apiRecipe.created_at,
                // TO DO: get images from API
                imageUrl: '',
              }) as RecipeBrief,
          ) || [];

        this._recipes.set(transformedRecipes);
      }),
      catchError((error) => {
        this._error.set(error.message);
        return throwError(() => error);
      }),
      finalize(() => {
        this._loading.set(false);
      }),
    );
  }
}
