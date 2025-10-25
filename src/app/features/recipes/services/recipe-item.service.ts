import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { RECIPES_API_ENDPOINTS } from '../constants';
import { BackendRecipe, Recipe } from '../recipe.model';
import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import {
  Observable,
  catchError,
  tap,
  throwError,
  map,
  switchMap,
  of,
  Subject,
  finalize,
} from 'rxjs';
import { CrudRecipesOperation, RecipeBucketHttpContext } from './utils';
import { UserService } from '../../../core/services/user.service';
import { RecipesStorageService } from './recipes-storage.service';
import { take } from 'rxjs/operators';

interface PresignedUrlResponse {
  presigned_url: string;
  key: string;
  method: string;
  expires_in: number;
}

interface CreateRecipeRequest {
  title: string;
  description: string;
  request_presigned_url?: boolean;
  filename?: string;
}

type CreateBucketExtendedResponse<T extends object> = T & {
  presigned_upload_url?: string;
  image_upload_key?: string;
};

interface RecipeState {
  recipe: Recipe | null;
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class RecipeItemService {
  private http = inject(HttpClient);
  private user = inject(UserService);
  private recipesStorageService = inject(RecipesStorageService);
  private readonly apiUrl = environment.apiUrl + RECIPES_API_ENDPOINTS.BASE + '/';

  private readonly operationNotifier = new Subject<CrudRecipesOperation>();

  readonly operationNotifier$ = this.operationNotifier.asObservable();

  readonly state = signal<RecipeState>({
    recipe: null,
    loading: false,
    error: null,
  });

  recipe = computed(() => this.state().recipe);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);

  constructor() {
    // Load cached current recipe on init
    this.recipesStorageService
      .loadRecipes()
      .pipe(take(1))
      .subscribe((cachedRecipe) => {
        if (cachedRecipe.length > 0) {
          this.state.update((state) => ({ ...state, recipe: cachedRecipe[0] }));
        }
      });
  }

  loadRecipeById(id: number): Observable<Recipe> {
    this.state.update((state) => ({ ...state, loading: true }));

    return this.http.get<BackendRecipe>(this.apiUrl + id + '/').pipe(
      map((backendRecipe) => Recipe.fromBackend(backendRecipe)),
      tap((recipe) => {
        this.state.update((state) => ({ ...state, recipe }));
        // Save to cache
        this.recipesStorageService.saveRecipes([recipe]);
      }),
      catchError((error) => {
        this.state.update((state) => ({ ...state, error }));
        return throwError(() => error);
      }),
      finalize(() => {
        this.state.update((state) => ({ ...state, loading: false }));
      }),
    );
  }

  addRecipe(recipe: Recipe, file?: File | null): Observable<Recipe> {
    this.state.update((state) => ({ ...state, loading: true }));

    const request: CreateRecipeRequest = {
      title: recipe.title,
      description: recipe.description,
    };

    if (file) {
      request.request_presigned_url = true;
      request.filename = file.name;
    }

    return this.http.post<CreateBucketExtendedResponse<Recipe>>(this.apiUrl, request).pipe(
      switchMap((response) => this.handleImageForNewRecipe(response, file)),
      map((backendRecipe) => Recipe.fromBackend(backendRecipe)),
      tap((newRecipe) => {
        this.state.update((state) => ({ ...state, recipe: newRecipe }));
        // Save to cache
        this.recipesStorageService.saveRecipes([newRecipe]);
        this.operationNotifier.next({ type: 'create', payload: newRecipe });
      }),
      catchError((error) => {
        this.state.update((state) => ({ ...state, error }));
        return throwError(() => error);
      }),
      finalize(() => {
        this.state.update((state) => ({ ...state, loading: false }));
      }),
    );
  }

  editRecipe(
    recipe: Recipe,
    file?: File | null,
    onSuccess?: () => void,
    onError?: (error: any) => void,
  ): Observable<Recipe> {
    this.state.update((state) => ({ ...state, loading: true, error: null }));

    return this.http
      .put<BackendRecipe>(this.apiUrl + recipe.id + '/', {
        title: recipe.title,
        description: recipe.description,
      })
      .pipe(
        switchMap((backendRecipe) =>
          this.handleImageForExistingRecipe(recipe.id, file, recipe.imageUrl, backendRecipe),
        ),
        map((backendRecipe) => Recipe.fromBackend(backendRecipe)),
        tap((updatedRecipe) => {
          this.state.update((state) => ({ ...state, recipe: updatedRecipe }));
          // Save to cache
          this.recipesStorageService.saveRecipes([updatedRecipe]);
          this.operationNotifier.next({ type: 'update', payload: updatedRecipe });
        }),
        catchError((error) => {
          this.state.update((state) => ({ ...state, error }));
          if (onError) onError(error);
          return throwError(() => error);
        }),
        finalize(() => {
          this.state.update((state) => ({ ...state, loading: false }));
        }),
      );
  }

  deleteRecipe(
    id: number,
    onSuccess?: () => void,
    onError?: (error: any) => void,
  ): Observable<void> {
    this.state.update((state) => ({ ...state, loading: true, error: null }));

    return this.http.delete<void>(this.apiUrl + id + '/').pipe(
      tap(() => {
        this.operationNotifier.next({ type: 'delete', payload: this.state().recipe! });
        this.state.update((state) => ({ ...state, loading: false }));
        if (onSuccess) onSuccess();
      }),
      catchError((error) => {
        this.state.update((state) => ({ ...state, error }));
        if (onError) onError(error);
        return throwError(() => error);
      }),
      finalize(() => {
        this.state.update((state) => ({ ...state, loading: false }));
      }),
    );
  }

  private generatePresignedUrl(
    method: 'GET' | 'PUT',
    key?: string,
    filename?: string,
  ): Observable<PresignedUrlResponse> {
    return this.http.post<PresignedUrlResponse>(this.apiUrl + 'presigned_url/', {
      method,
      key,
      filename,
    });
  }

  private handleImageForNewRecipe(
    response: CreateBucketExtendedResponse<Recipe>,
    file?: File | null,
  ): Observable<BackendRecipe> {
    if (file && response.presigned_upload_url && response.image_upload_key) {
      return this.uploadImageToBucket(response.presigned_upload_url, file).pipe(
        switchMap(() => this.updateRecipeImage(response.id, response.image_upload_key!)),
        switchMap(() => this.http.get<BackendRecipe>(this.apiUrl + response.id + '/')),
      );
    }
    return of(response);
  }

  private handleImageForExistingRecipe(
    recipeId: number,
    newFile?: File | null | undefined,
    currentImageUrl?: string,
    backendRecipe?: BackendRecipe,
  ): Observable<BackendRecipe> {
    console.log({ recipeId, file: newFile, currentImageUrl, backendRecipe });
    if (newFile) {
      return this.generatePresignedUrl('PUT', undefined, newFile.name).pipe(
        switchMap((presigned) =>
          this.uploadAndUpdateImage(presigned.presigned_url, newFile, recipeId, presigned.key),
        ),
        switchMap(() => this.http.get<BackendRecipe>(this.apiUrl + recipeId + '/')),
      );
    } else if (newFile === null) {
      return this.updateRecipeImage(recipeId, '').pipe(
        switchMap(() => this.http.get<BackendRecipe>(this.apiUrl + recipeId + '/')),
      );
    }
    return of(backendRecipe || ({} as BackendRecipe));
  }

  private uploadAndUpdateImage(
    presignedUrl: string,
    file: File,
    recipeId: number,
    key: string,
  ): Observable<void> {
    console.log('Uploading image...', presignedUrl, file, recipeId, key);
    return this.uploadImageToBucket(presignedUrl, file).pipe(
      switchMap(() => this.updateRecipeImage(recipeId, key)),
    );
  }

  private uploadImageToBucket(presignedUrl: string, file: File): Observable<void> {
    return this.http
      .put(presignedUrl, file, {
        headers: new HttpHeaders({}),
        responseType: 'text',
        context: RecipeBucketHttpContext,
      })
      .pipe(
        map(() => void 0),
        catchError((error) =>
          throwError(() => new Error('Failed to upload image: ' + error.message)),
        ),
      );
  }

  private updateRecipeImage(recipeId: number, imageBucketKey: string): Observable<any> {
    return this.http.patch(this.apiUrl + recipeId + '/update_image/', {
      image_bucket_key: imageBucketKey,
    });
  }

  clearCurrentRecipe() {
    this.state.set({ recipe: null, loading: false, error: null });
    // Clear cache
    this.recipesStorageService.saveRecipes([]);
  }

  readonly isOwner = computed(() => {
    const recipe = this.state().recipe;
    const username = this.user.username();
    return recipe && username && recipe.owner === username;
  });
}
