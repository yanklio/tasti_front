import { DestroyRef, Directive, ElementRef, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SessionService } from '../services/session.service';
import { SuggestAuthDialogComponent } from '../../shared/components/suggest-auth-dialog/suggest-auth-dialog';

@Directive({
  selector: '[appSuggestAuth]',
  standalone: true,
})
export class SuggestAuth {
  constructor() {
    const dialog = inject(MatDialog);
    const sessionService = inject(SessionService);
    const elementRef = inject(ElementRef<HTMLElement>);
    const destroyRef = inject(DestroyRef);

    const captureClick = (event: Event) => {
      if (!sessionService.isAuthenticated()) {
        event.stopImmediatePropagation();
        event.preventDefault();
        event.stopPropagation();
        dialog.open(SuggestAuthDialogComponent);
      }
    };

    elementRef.nativeElement.addEventListener('click', captureClick, true);

    destroyRef.onDestroy(() => {
      elementRef.nativeElement.removeEventListener('click', captureClick, true);
    });
  }
}
