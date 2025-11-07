import { ChangeDetectionStrategy, Component, input, inject, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RecipeBrief } from '../../recipe.model';
import { RECIPES_ROUTES } from '../../constants';
import { GLOBAL_ROUTES } from '../../../../constants';
import { UsernamePipe } from '../../../../core/pipes/username-pipe';
import { UserService } from '../../../../core/services/user.service';
import { RecipeItemService } from '../../services/recipe-item.service';

@Component({
  selector: 'app-recipes-card',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    UsernamePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './recipes-card.html',
  styleUrl: './recipes-card.css',
})
export class RecipesCard {
  private readonly router = inject(Router);
  private readonly user = inject(UserService);
  private readonly recipeItemService = inject(RecipeItemService);
  private readonly snackBar = inject(MatSnackBar);

  readonly recipe = input.required<RecipeBrief>();
  readonly isOwner = computed(() => this.user.isOwner(this.recipe()));

  onViewDetails() {
    this.router.navigate([GLOBAL_ROUTES.RECIPES, this.recipe().id]);
  }

  onEdit() {
    this.router.navigate([GLOBAL_ROUTES.RECIPES, RECIPES_ROUTES.EDIT_RECIPE, this.recipe().id]);
  }

  onCopyLink() {
    const url =
      window.location.origin +
      this.router.createUrlTree([GLOBAL_ROUTES.RECIPES, this.recipe().id]).toString();
    navigator.clipboard
      .writeText(url)
      .then(() => {
        this.snackBar.open('Link successfully copied', 'Dismiss', { duration: 3000 });
      })
      .catch((err) => {
        console.error('Failed to copy link:', err);
        this.snackBar.open('Failed to copy link', 'Dismiss', { duration: 3000 });
      });
  }

  onDelete() {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      this.recipeItemService
        .deleteRecipe(
          this.recipe().id,
          () => {
            // On success, navigate back to recipes list to refresh
            this.router.navigate([GLOBAL_ROUTES.RECIPES, RECIPES_ROUTES.RECIPES_LIST]);
          },
          (error) => {
            console.error('Failed to delete recipe:', error);
            // Optionally show a snackbar or alert
          },
        )
        .subscribe();
    }
  }
}
