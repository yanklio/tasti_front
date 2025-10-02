import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { RECIPES_API_ENDPOINTS } from '../constants';
import { BackendRecipe, Recipe } from '../recipe.model';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap, throwError, map, switchMap, of, from } from 'rxjs';

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

interface CreateRecipeResponse extends BackendRecipe {
  presigned_upload_url?: string;
  image_upload_key?: string;
}

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

    return this.http.get<BackendRecipe>(this.apiUrl + id + '/').pipe(
      map((backendRecipe) => Recipe.fromBackend(backendRecipe)),
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

  addRecipe(recipe: Recipe, file?: File | null): Observable<Recipe> {
    this._loading.set(true);
    this._error.set(null);

    const request: CreateRecipeRequest = {
      title: recipe.title,
      description: recipe.description,
    };

    if (file) {
      request.request_presigned_url = true;
      request.filename = file.name;
    }

    return this.http.post<CreateRecipeResponse>(this.apiUrl, request).pipe(
      switchMap((response) => this.handleImageForNewRecipe(response, file)),
      map((backendRecipe) => Recipe.fromBackend(backendRecipe)),
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
    file?: File | null,
    onSuccess?: () => void,
    onError?: (error: any) => void,
  ): Observable<Recipe> {
    this._loading.set(true);
    this._error.set(null);

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
    response: CreateRecipeResponse,
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
    file?: File | null,
    currentImageUrl?: string,
    backendRecipe?: BackendRecipe,
  ): Observable<BackendRecipe> {
    if (file) {
      return this.generatePresignedUrl('PUT', undefined, file.name).pipe(
        switchMap((presigned) =>
          this.uploadAndUpdateImage(presigned.presigned_url, file, recipeId, presigned.key),
        ),
        switchMap(() => this.http.get<BackendRecipe>(this.apiUrl + recipeId + '/')),
      );
    } else if (file === null && currentImageUrl) {
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
    return from(
      fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': 'image/jpeg',
        },
      }).then((response) => {
        if (!response.ok) {
          throw new Error(`Upload failed with status ${response.status}`);
        }
      }),
    ).pipe(
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
}
