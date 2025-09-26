import { DestroyRef, Directive, ElementRef, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SessionService } from '../services/session.service';

@Directive({
  selector: '[appAuthRequired]',
  standalone: true,
})
export class AuthRequired {
  constructor() {
    const snackBar = inject(MatSnackBar);
    const sessionService = inject(SessionService);
    const elementRef = inject(ElementRef<HTMLElement>);
    const destroyRef = inject(DestroyRef);

    const captureClick = (event: Event) => {
      if (!sessionService.isAuthenticated()) {
        event.stopImmediatePropagation();
        event.preventDefault();
        event.stopPropagation();
        snackBar.open('This action is only for authenticated users', 'Close', {
          duration: 3000,
        });
      }
    };

    elementRef.nativeElement.addEventListener('click', captureClick, true);

    destroyRef.onDestroy(() => {
      elementRef.nativeElement.removeEventListener('click', captureClick, true);
    });
  }
}
