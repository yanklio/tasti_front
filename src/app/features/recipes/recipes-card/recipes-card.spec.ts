import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipesCard } from './recipes-card';

describe('RecipesCard', () => {
  let component: RecipesCard;
  let fixture: ComponentFixture<RecipesCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipesCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipesCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
