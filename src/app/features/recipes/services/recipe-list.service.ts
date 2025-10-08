import { computed, inject, Injectable, signal } from '@angular/core';
import { BackendRecipeBrief, RecipeBrief } from '../recipe.model';
import { environment } from '../../../../environments/environment';
import { RECIPES_API_ENDPOINTS, RECIPES_ROUTES } from '../constants';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, finalize, Observable, tap, throwError, map, Subject } from 'rxjs';
import { PaginatedResponse, PaginationState } from '../../../core/models/pagination';
import { RecipesStorageService } from './recipes-storage.service';
import { RecipeItemService } from './recipe-item.service';
import { CrudRecipesOperation } from './utils';
import { take } from 'rxjs/operators';

interface RecipeBriefState {
  recipes: RecipeBrief[];
  loading: boolean;
  error: string | null;
}

interface PaginationParams {
  page: number;
  pageSize: number;
}

@Injectable()
export default class RecipeListService {
  private http = inject(HttpClient);

  private recipeItemService = inject(RecipeItemService);
  private recipesStorageService = inject(RecipesStorageService);

  private readonly apiUrl = environment.apiUrl + RECIPES_API_ENDPOINTS.BASE + '/';

  private recipesState = signal<RecipeBriefState>({
    recipes: [],
    loading: false,
    error: null,
  });

  private paginationState = signal<PaginationState>({
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
    totalItems: 0,
    hasNext: false,
    hasPrevious: false,
    nextLink: null,
    previousLink: null,
  });

  recipes = computed(() => this.recipesState().recipes);
  loading = computed(() => this.recipesState().loading);
  error = computed(() => this.recipesState().error);

  pagination = computed(() => this.paginationState());

  constructor() {
    this.recipeItemService.operationNotifier$.subscribe((operation) => {
      switch (operation.type) {
        case 'create':
          this.recipesState.update((state) => ({
            ...state,
            recipes: [...state.recipes, operation.payload],
          }));
          this.paginationState.update((p) => ({
            ...p,
            totalItems: p.totalItems + 1,
            totalPages: Math.ceil((p.totalItems + 1) / p.pageSize),
          }));
          break;
        case 'update':
          this.recipesState.update((state) => ({
            ...state,
            recipes: state.recipes.map((r) =>
              r.id === operation.payload.id ? operation.payload : r,
            ),
          }));
          break;
        case 'delete':
          this.recipesState.update((state) => ({
            ...state,
            recipes: state.recipes.filter((r) => r.id !== operation.payload.id),
          }));
          this.paginationState.update((p) => ({
            ...p,
            totalItems: p.totalItems - 1,
            totalPages: Math.ceil((p.totalItems - 1) / p.pageSize),
          }));
          break;
      }
    });
  }

  getRecipes(pagination: PaginationParams): Observable<PaginatedResponse<RecipeBrief>> {
    this.recipesState.update((state) => ({ ...state, loading: true, error: null }));

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
        this.recipesState.update((state) => ({ ...state, recipes: response.results }));

        const paginationState = {
          currentPage: pagination.page,
          pageSize: pagination.pageSize,
          totalPages: response.total_pages,
          totalItems: response.total,
          hasNext: !!response.links.next,
          nextLink: response.links.next,
          hasPrevious: !!response.links.previous,
          previousLink: response.links.previous,
        };
        this.paginationState.set(paginationState);
      }),
      catchError((error) => {
        this.recipesState.update((state) => ({ ...state, error: error.message }));
        return throwError(() => error);
      }),
      finalize(() => {
        this.recipesState.update((state) => ({ ...state, loading: false }));
      }),
    );
  }
}
