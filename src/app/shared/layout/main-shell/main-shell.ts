import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainLayout } from '../main-layout/main-layout';

@Component({
  selector: 'app-main-shell',
  imports: [RouterOutlet, MainLayout],
  template: '<app-main-layout><router-outlet /></app-main-layout>',
})
export class MainShell {}
