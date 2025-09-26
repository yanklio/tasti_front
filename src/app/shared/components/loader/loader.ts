import { Component, input } from '@angular/core';
import { LogoComponent } from '../logo/logo';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [LogoComponent],
  templateUrl: './loader.html',
  styleUrl: './loader.css',
})
export class LoaderComponent {
  size = input<number>(72);
}
