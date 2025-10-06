import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-suggest-auth-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './suggest-auth-dialog.html',
  styleUrl: './suggest-auth-dialog.css',
})
export class SuggestAuthDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<SuggestAuthDialogComponent>);
  private readonly router = inject(Router);

  onLogin(): void {
    this.dialogRef.close();
    this.router.navigate(['/auth/login']);
  }

  onRegister(): void {
    this.dialogRef.close();
    this.router.navigate(['/auth/register']);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}