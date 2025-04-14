import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RatingCreateModalComponent } from './rating-create-modal.component';

describe('RatingCreateModalComponent', () => {
  let component: RatingCreateModalComponent;
  let fixture: ComponentFixture<RatingCreateModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RatingCreateModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RatingCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
