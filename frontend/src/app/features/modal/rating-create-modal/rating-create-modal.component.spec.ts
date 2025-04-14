import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RatingCreateModalComponent } from './rating-create-modal.component';
import { provideHttpClient } from '@angular/common/http';

describe('RatingCreateModalComponent', () => {
  let component: RatingCreateModalComponent;
  let fixture: ComponentFixture<RatingCreateModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RatingCreateModalComponent],
      providers: [
        provideHttpClient(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RatingCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
