import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LogoComponent } from '../../../shared/components/logo/logo';
import { AuthService as sessionService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginRequest } from '../../../core/models/auth.model';
import { SessionService } from '../../../core/services/session.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    LogoComponent,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private router = inject(Router);
  private _snackBar = inject(MatSnackBar);

  private sessionService = inject(SessionService);

  loginForm: FormGroup;
  hidePassword = true;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.sessionService.login(new LoginRequest(username, password)).subscribe({
        next: (response) => {
          this._snackBar.open('Login successful', 'Dismiss', {
            duration: 5000,
          });
          this.router.navigate(['/']);
        },
        error: (error) => {
          // TODO: Normal error handling
          this._snackBar.open('Login failed', 'Dismiss', {
            duration: 5000,
          });
        },
      });
    } else {
      this._snackBar.open('Form is invalid', 'Dismiss', {
        duration: 5000,
      });
    }
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
