import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppBuildInfoComponent } from './app-build-info.component';

describe('AppBuildInfoComponent', () => {
  let component: AppBuildInfoComponent;
  let fixture: ComponentFixture<AppBuildInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AppBuildInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppBuildInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
