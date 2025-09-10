import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthLayout } from '../../shared/layout/auth-layout/auth-layout';

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet, AuthLayout],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {}
