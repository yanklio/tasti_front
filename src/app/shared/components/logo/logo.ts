import { Component, input, computed, output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logo',
  standalone: true,
  template: `
    <img
      [src]="logoSrc()"
      [alt]="alt()"
      [style.width.px]="width()"
      [style.height.px]="height()"
      [style.cursor]="clickable() ? 'pointer' : 'default'"
      class="logo"
      (click)="handleClick()"
    />
  `,
  styleUrl: './logo.css',
})
export class LogoComponent {
  width = input<number>(64);
  height = input<number>(64);
  clickable = input<boolean>(false);
  alt = input<string>('Tasti Logo');

  logoClicked = output<void>();

  logoSrc = computed(() => '/assets/brand/logo.svg');

  constructor(private router: Router) {}

  handleClick(): void {
    if (this.clickable()) {
      this.logoClicked.emit();
      this.router.navigate(['/']);
    }
  }
}
