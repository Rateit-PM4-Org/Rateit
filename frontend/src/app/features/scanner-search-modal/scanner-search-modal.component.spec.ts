import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ScannerSearchModalComponent } from './scanner-search-modal.component';

describe('ScannerSearchModalComponent', () => {
  let component: ScannerSearchModalComponent;
  let fixture: ComponentFixture<ScannerSearchModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ScannerSearchModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScannerSearchModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
