import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppBuildInfoComponent } from './app-build-info.component';
import { provideHttpClient } from '@angular/common/http';
import { provideMockApiService } from '../../../shared/test-util/test-util';
import { ApiService } from '../../../shared/services/api.service';
import { of } from 'rxjs';

describe('AppBuildInfoComponent', () => {
  let component: AppBuildInfoComponent;
  let fixture: ComponentFixture<AppBuildInfoComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  beforeEach(waitForAsync(() => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['get']);
    apiServiceSpy.get.and.returnValue(of(null)); // Mock the get method to return an observable
    TestBed.configureTestingModule({
      imports: [AppBuildInfoComponent],
      providers: [
        {provide: ApiService, useValue: apiServiceSpy},
        provideHttpClient()
      
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppBuildInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
