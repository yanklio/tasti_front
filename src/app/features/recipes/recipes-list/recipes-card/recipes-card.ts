import { ChangeDetectionStrategy, Component, input, inject, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { RecipeBrief } from '../../recipe.model';
import { RECIPES_ROUTES } from '../../constants';
import { GLOBAL_ROUTES } from '../../../../constants';
import { UsernamePipe } from '../../../../core/pipes/username-pipe';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-recipes-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule, UsernamePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './recipes-card.html',
  styleUrl: './recipes-card.css',
})
export class RecipesCard {
  private readonly router = inject(Router);
  private readonly user = inject(UserService);

  readonly recipe = input.required<RecipeBrief>();
  readonly isOwner = computed(() => this.user.isOwner(this.recipe()));

  onViewDetails() {
    this.router.navigate([GLOBAL_ROUTES.RECIPES, this.recipe().id]);
  }

  onEdit() {
    this.router.navigate([GLOBAL_ROUTES.RECIPES, RECIPES_ROUTES.EDIT_RECIPE, this.recipe().id]);
  }
}
