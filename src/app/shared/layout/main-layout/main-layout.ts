import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Sidebar } from './sidebar/sidebar';

@Component({
  selector: 'app-main-layout',
  imports: [MatSidenavModule, Sidebar],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {}
