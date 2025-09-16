import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { Router } from '@angular/router';
import RecipesService from '../recipes.service';
import { Recipe } from '../recipe.model';
import { MainLayout } from '../../../shared/layout/main-layout/main-layout';


@Component({
  selector: 'app-create-recipe',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCardModule, MatExpansionModule, MainLayout],
  templateUrl: './create-recipe.html',
  styleUrl: './create-recipe.css',
  providers: [RecipesService]
})
export class CreateRecipe implements OnInit {
  recipeForm!: FormGroup;
  imageSrc: string | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private recipesService: RecipesService
  ) {}

  ngOnInit() {
    this.recipeForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      imageUrl: [''],
    });
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
    if (this.recipeForm.valid) {
      const formValue = this.recipeForm.value;
      const recipe: Recipe = {
        id: 0, // Will be set in service
        title: formValue.title,
        description: formValue.description,
        ingredients: [],
        imageUrl: formValue.imageUrl || '',
      };
      this.recipesService.addRecipe(recipe);
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
