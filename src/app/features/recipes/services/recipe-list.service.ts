import { inject, Injectable, signal } from '@angular/core';
import { BackendRecipeBrief, RecipeBrief } from '../recipe.model';
import { environment } from '../../../../environments/environment';
import { RECIPES_API_ENDPOINTS, RECIPES_ROUTES } from '../constants';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, finalize, Observable, tap, throwError, map } from 'rxjs';
import { PaginatedResponse, PaginationState } from '../../../core/models/pagination';

interface PaginationParams {
  page: number;
  pageSize: number;
}

@Injectable()
export default class RecipeListService {
  private http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl + RECIPES_API_ENDPOINTS.BASE + '/';

  private _recipes = signal<RecipeBrief[]>([]);
  private _loading = signal(true);
  private _error = signal<string | null>(null);
  private _paginationState = signal<PaginationState>({
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
    totalItems: 0,
    hasNext: false,
    nextLink: null,
    hasPrevious: false,
    previousLink: null,
  });

  readonly recipes = this._recipes.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly paginationState = this._paginationState.asReadonly();

  readonly state = {
    recipes: this.recipes,
    loading: this.loading,
    error: this.error,
    paginationState: this.paginationState,
  };

  loadRecipes(pagination: PaginationParams): Observable<PaginatedResponse<RecipeBrief>> {
    this._loading.set(true);
    this._error.set(null);

    const params = new HttpParams()
      .set('page', pagination.page.toString())
      .set('page_size', pagination.pageSize.toString());

    return this.http.get<PaginatedResponse<BackendRecipeBrief>>(this.apiUrl, { params }).pipe(
      map(
        (response): PaginatedResponse<RecipeBrief> => ({
          ...response,
          results:
            response.results?.map((backendRecipe: BackendRecipeBrief) =>
              RecipeBrief.fromBackend(backendRecipe),
            ) || [],
        }),
      ),
      tap((response) => {
        this._recipes.set(response.results);

        this._paginationState.set({
          currentPage: pagination.page,
          pageSize: pagination.pageSize,
          totalPages: response.total_pages,
          totalItems: response.total,
          hasNext: !!response.links.next,
          nextLink: response.links.next,
          hasPrevious: !!response.links.previous,
          previousLink: response.links.previous,
        });
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
