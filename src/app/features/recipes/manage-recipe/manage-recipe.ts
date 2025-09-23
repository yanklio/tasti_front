import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import RecipesService from '../recipes.service';
import { Recipe } from '../recipe.model';
import { MainLayout } from '../../../shared/layout/main-layout/main-layout';
import { ImageUpload } from '../../../shared/components/image-upload/image-upload';

@Component({
  selector: 'app-manage-recipe',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCardModule, MatExpansionModule, MatSnackBarModule, MainLayout, ImageUpload],
  templateUrl: './manage-recipe.html',
  styleUrl: './manage-recipe.css',
})
export class ManageRecipe implements OnInit {
  mode: 'create' | 'edit' = 'create';
  recipeId?: number;

  recipeForm!: FormGroup;
  imageSrc: string | null = null;
  recipe: Recipe | undefined;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private recipesService = inject(RecipesService);
  private snackBar = inject(MatSnackBar);

  ngOnInit() {
    this.mode = this.route.snapshot.data['mode'] || 'create';
    this.initializeForm();

    if (this.mode === 'edit') {
      this.recipeId = +this.route.snapshot.params['id'];
      // TODO: Handle loading and error states
      this.recipe = this.recipesService.getRecipe(this.recipeId).data!;


      if (!this.recipe) {
        this.snackBar.open('Recipe not found', 'Close', { duration: 3000 });
        this.router.navigate(['/']);
        return;
      }

      this.recipeForm.patchValue({
        title: this.recipe.title,
        description: this.recipe.description,
        imageUrl: this.recipe.imageUrl,
      });
      this.imageSrc = this.recipe.imageUrl;
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
      };
      this.recipesService.addRecipe(newRecipe);
    } else if (this.mode === 'edit' && this.recipe) {
      const updatedRecipe: Recipe = {
        ...this.recipe,
        ...recipeData,
      };
      this.recipesService.updateRecipe(updatedRecipe);
    }

    this.router.navigate(['/']);
  }

  onCancel() {
    this.router.navigate(['/']);
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
