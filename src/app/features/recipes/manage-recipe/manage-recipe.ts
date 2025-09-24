import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, ROUTES } from '@angular/router';
import { Recipe } from '../recipe.model';
import { ImageUpload } from '../../../shared/components/image-upload/image-upload';
import { RecipeItemService } from '../services/recipe-item.service';
import { RECIPES_ROUTES } from '../constants';

@Component({
  selector: 'app-manage-recipe',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatExpansionModule,
    MatSnackBarModule,
    ImageUpload,
  ],
  templateUrl: './manage-recipe.html',
  styleUrl: './manage-recipe.css',
})
export class ManageRecipe {
  mode: 'create' | 'edit' = 'create';
  recipeId?: number;

  recipeForm!: FormGroup;
  imageSrc: string | null = null;
  recipe: Recipe | undefined;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private recipeItemService = inject(RecipeItemService);

  constructor() {
    this.mode = this.route.snapshot.data['mode'] || 'create';
    this.initializeForm();

    if (this.mode === 'edit') {
      this.recipeId = +this.route.snapshot.params['id'];

      if (this.recipeId) {
        this.recipeItemService.loadRecipeById(this.recipeId).subscribe({
          next: (recipe) => {
            this.recipe = recipe;
            this.recipeForm.patchValue({
              title: recipe.title,
              description: recipe.description,
              imageUrl: recipe.imageUrl,
            });
            this.imageSrc = recipe.imageUrl || null;
          },
          error: (error) => {
            this.snackBar.open('Recipe not found: ' + error.message, 'Close', { duration: 3000 });
            this.router.navigate(['/']);
          },
        });
      } else {
        this.snackBar.open('Invalid recipe ID', 'Close', { duration: 3000 });
        this.router.navigate(['/']);
      }
    }
  }

  private initializeForm() {
    this.recipeForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      imageUrl: [''],
    });
  }

  onSubmit() {
    if (!this.recipeForm.valid) return;

    const formValue = this.recipeForm.value;
    const recipeData = {
      title: formValue.title,
      description: formValue.description,
      imageUrl: formValue.imageUrl || '',
    };

    if (this.mode === 'create') {
      const newRecipe: Recipe = {
        id: 0,
        ...recipeData,
        ingredients: [],
        owner: 'to-set-on-the-backend',
      };
      this.recipeItemService.addRecipe(newRecipe).subscribe({
        next: (createdRecipe) => {
          this.snackBar.open('Recipe created successfully', 'Dismiss', { duration: 3000 });
          this.router.navigate(['/' + RECIPES_ROUTES.RECIPES_LIST]);
        },
        error: (error) => {
          this.snackBar.open('Failed to create recipe: ' + error.message, 'Dismiss', {
            duration: 3000,
          });
        },
      });
    } else if (this.mode === 'edit' && this.recipe) {
      const updatedRecipe: Recipe = {
        ...this.recipe,
        ...recipeData,
      };
      this.recipeItemService.editRecipe(updatedRecipe).subscribe({
        next: (updatedRecipe) => {
          this.snackBar.open('Recipe updated successfully', 'Dismiss', { duration: 3000 });
          this.router.navigate(['/' + RECIPES_ROUTES.RECIPES_LIST]);
        },
        error: (error) => {
          this.snackBar.open('Failed to update recipe: ' + error.message, 'Dismiss', {
            duration: 3000,
          });
        },
      });
    }
  }

  // handleRecipeOperationResult method removed as we're now handling responses directly in the subscriptions

  onCancel() {
    this.router.navigate([RECIPES_ROUTES.RECIPES_LIST]);
  }

  onImageSrcChange(imageSrc: string | null) {
    this.imageSrc = imageSrc;
    this.recipeForm.patchValue({ imageUrl: imageSrc || '' });
  }

  get headerText(): string {
    return this.mode === 'create' ? 'Create New Recipe' : 'Edit Recipe';
  }

  get buttonText(): string {
    return this.mode === 'create' ? 'Create Recipe' : 'Update Recipe';
  }

  get buttonIcon(): string {
    return this.mode === 'create' ? 'library_add' : 'update';
  }
}
