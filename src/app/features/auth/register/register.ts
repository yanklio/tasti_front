import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LogoComponent } from '../../../shared/components/logo/logo';
import { BadgeComponent } from '../../../shared/components/badge/badge';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest } from '../../../core/models/auth.model';
import { SessionService } from '../../../core/services/session.service';
import { AUTH_API_ENDPOINTS } from '../../../core/constants';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    LogoComponent,
    BadgeComponent,
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private router = inject(Router);
  private _snackBar = inject(MatSnackBar);

  private sessionService = inject(SessionService);

  loginLink = '/' + AUTH_API_ENDPOINTS.BASE + AUTH_API_ENDPOINTS.LOGIN;

  registerForm: FormGroup;
  hidePassword = true;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { username, password } = this.registerForm.value;

      this.sessionService.register(new RegisterRequest(username, password)).subscribe({
        next: () => {
          this._snackBar.open('Registration successful!', 'Dismiss', { duration: 5000 });
          this.router.navigate(['/']);
        },
        error: (error) => {
          // TODO: Normal error handling
          this._snackBar.open('Registration failed', 'Dismiss', {
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
