import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ScannertestComponent } from './scannertest.component';

describe('ScannertestComponent', () => {
  let component: ScannertestComponent;
  let fixture: ComponentFixture<ScannertestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ScannertestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScannertestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
