import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SuggestAuthDialogComponent } from './suggest-auth-dialog';

describe('SuggestAuthDialogComponent', () => {
  let component: SuggestAuthDialogComponent;
  let fixture: ComponentFixture<SuggestAuthDialogComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<SuggestAuthDialogComponent>>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [SuggestAuthDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SuggestAuthDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog and navigate to login on login button click', () => {
    component.onLogin();
    expect(mockDialogRef.close).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should close dialog and navigate to register on register button click', () => {
    component.onRegister();
    expect(mockDialogRef.close).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/register']);
  });

  it('should close dialog on cancel button click', () => {
    component.onCancel();
    expect(mockDialogRef.close).toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
