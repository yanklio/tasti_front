import { Component, effect, inject, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { ImageUpload } from '../../../shared/components/image-upload/image-upload';
import { RecipeItemService } from '../services/recipe-item.service';
import { RECIPES_ROUTES } from '../constants';
import { LoaderComponent } from '../../../shared/components/loader/loader';
import { BackHeader } from '../../../shared/components/back-header/back-header';

type ManageRecipeMode = 'create' | 'edit';

@Component({
  selector: 'app-manage-recipe',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatExpansionModule,
    MatDividerModule,
    MatSnackBarModule,
    ImageUpload,
    LoaderComponent,
    BackHeader,
  ],
  templateUrl: './manage-recipe.html',
  styleUrl: './manage-recipe.css',
})
export class ManageRecipe {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);
  private readonly recipeItemService = inject(RecipeItemService);

  private recipeId?: number;

  readonly mode = signal<ManageRecipeMode>('create');
  readonly recipeForm: FormGroup;
  readonly imageSrc = signal<string | null>(null);
  readonly selectedFile = signal<File | null | undefined>(undefined);

  readonly recipe = this.recipeItemService.recipe;
  readonly loading = this.recipeItemService.loading;
  readonly error = this.recipeItemService.error;

  constructor() {
    this.recipeForm = this.createForm();
    this.setupComponent();
  }

  get headerText(): string {
    return this.mode() === 'create' ? 'Create New Recipe' : 'Edit Recipe';
  }

  get buttonText(): string {
    return this.mode() === 'create' ? 'Create Recipe' : 'Update Recipe';
  }

  get buttonIcon(): string {
    return this.mode() === 'create' ? 'library_add' : 'update';
  }

  onSubmit(): void {
    if (!this.recipeForm.valid) return;

    const recipeData = this.prepareRecipeData();

    if (this.mode() === 'create') {
      this.createRecipe(recipeData);
    } else if (this.mode() === 'edit' && this.recipe()) {
      this.updateRecipe(recipeData);
    }
  }

  onCancel(): void {
    this.router.navigate([RECIPES_ROUTES.RECIPES_LIST]);
  }

  onImageFileChange(file: File | null): void {
    this.selectedFile.set(file);
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      this.imageSrc.set(imageUrl);
    } else {
      this.imageSrc.set(null);
    }
    this.recipeForm.patchValue({ imageUrl: this.imageSrc() || '' });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      difficulty: ['easy', Validators.required],
      duration: ['00:00', [Validators.required]],
      imageUrl: [''],
    });
  }

  private setupComponent(): void {
    const routeMode = this.route.snapshot.data['mode'] as ManageRecipeMode;
    this.mode.set(routeMode || 'create');

    if (this.mode() === 'edit') {
      this.setupEditMode();
    }

    if (this.mode() === 'create') {
      this.recipeItemService.clearCurrentRecipe();
    }

    this.setupEffects();
  }

  private setupEditMode(): void {
    this.recipeId = +this.route.snapshot.params['id'];

    if (this.recipeId) {
      // Check if the current recipe is already loaded by owner guard
      const currentRecipe = this.recipeItemService.recipe();
      if (!currentRecipe || currentRecipe.id !== this.recipeId) {
        this.recipeItemService.loadRecipeById(this.recipeId).subscribe({
          next: (recipe) => {
            this.updateFormWithRecipe(recipe);
          },
          error: (error) => {
            this.handleServiceError(error);
          },
        });
      }
    }
  }

  private setupEffects(): void {
    effect(() => {
      if (this.recipe()) {
        this.updateFormWithRecipe(this.recipe()!);
      }
    });

    effect(() => {
      if (this.error()) {
        this.handleServiceError(this.error()!);
      }
    });
  }

  private updateFormWithRecipe(recipe: Recipe): void {
    const duration = recipe.duration.split(':').slice(0, 2).join(':');
    this.recipeForm.patchValue({
      title: recipe.title,
      description: recipe.description,
      difficulty: recipe.difficulty,
      duration,
      imageUrl: recipe.imageUrl,
    });
    this.imageSrc.set(recipe.imageUrl || null);
  }

  private prepareRecipeData(): Partial<Recipe> {
    const formValue = this.recipeForm.value;
    return {
      title: formValue.title,
      description: formValue.description,
      difficulty: formValue.difficulty,
      duration: formValue.duration + ':00',
    };
  }

  private createRecipe(recipeData: Partial<Recipe>): void {
    const newRecipe = new Recipe(
      0,
      recipeData.title || '',
      recipeData.description || '',
      '',
      recipeData.difficulty || 'easy',
      recipeData.duration || '',
      'to-set-on-the-backend',
    );

    this.recipeItemService.addRecipe(newRecipe, this.selectedFile()).subscribe({
      next: () => this.handleSuccess('Recipe created successfully'),
      error: (error) => this.handleError('Failed to create recipe', error),
    });
  }

  private updateRecipe(recipeData: Partial<Recipe>): void {
    const currentRecipe = this.recipe();
    if (!currentRecipe) return;

    const updatedRecipe = new Recipe(
      currentRecipe.id,
      recipeData.title || currentRecipe.title,
      recipeData.description || currentRecipe.description,
      currentRecipe.owner,
      recipeData.difficulty || currentRecipe.difficulty,
      recipeData.duration || currentRecipe.duration,
      recipeData.imageUrl || currentRecipe.imageUrl,
    );

    this.recipeItemService.editRecipe(updatedRecipe, this.selectedFile()).subscribe({
      next: () => this.handleSuccess('Recipe updated successfully'),
      error: (error) => this.handleError('Failed to update recipe', error),
    });
  }

  private handleSuccess(message: string): void {
    this.snackBar.open(message, 'Dismiss', { duration: 3000 });
    this.router.navigate([RECIPES_ROUTES.RECIPES_LIST]);
  }

  private handleError(prefix: string, error: any): void {
    this.snackBar.open(`${prefix}: ${error.message}`, 'Dismiss', {
      duration: 3000,
    });
  }

  private handleServiceError(error: string): void {
    this.snackBar.open('Recipe not found: ' + error, 'Close', { duration: 3000 });
    this.router.navigate([RECIPES_ROUTES.RECIPES_LIST]);
  }
}
