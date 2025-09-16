import { Component, OnInit, ViewChild, ElementRef, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { ActivatedRoute, Router } from '@angular/router';
import RecipesService from '../recipes.service';
import { Recipe } from '../recipe.model';
import { MainLayout } from '../../../shared/layout/main-layout/main-layout';

@Component({
  selector: 'app-edit-recipe',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCardModule, MatExpansionModule, MainLayout],
  templateUrl: './edit-recipe.html',
  styleUrl: './edit-recipe.css',
})
export class EditRecipe implements OnInit {
  recipeForm!: FormGroup;
  imageSrc: string | null = null;
  recipe: Recipe | undefined;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private recipesService = inject(RecipesService);

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.recipe = this.recipesService.getRecipe(+id);
      if (this.recipe) {
        this.recipeForm = this.fb.group({
          title: [this.recipe.title, Validators.required],
          description: [this.recipe.description, Validators.required],
          imageUrl: [this.recipe.imageUrl],
        });
        this.imageSrc = this.recipe.imageUrl;
      }
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        this.imageSrc = URL.createObjectURL(file);
        this.recipeForm.patchValue({ imageUrl: this.imageSrc });
      }
    }
  }

  onSubmit() {
    if (this.recipeForm.valid && this.recipe) {
      const formValue = this.recipeForm.value;
      const updatedRecipe: Recipe = {
        ...this.recipe,
        title: formValue.title,
        description: formValue.description,
        imageUrl: formValue.imageUrl || '',
      };
      this.recipesService.updateRecipe(updatedRecipe);
      this.router.navigate(['/']);
    }
  }

  onCancel() {
    this.router.navigate(['/']);
  }

  removeImage() {
    this.imageSrc = null;
    this.recipeForm.patchValue({ imageUrl: '' });
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        this.imageSrc = URL.createObjectURL(file);
        this.recipeForm.patchValue({ imageUrl: this.imageSrc });
      }
    }
  }
}
