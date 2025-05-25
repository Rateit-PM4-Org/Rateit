import {TestBed, waitForAsync} from '@angular/core/testing';

import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {Router} from '@angular/router';
import {of, throwError} from 'rxjs';
import {ApiService} from '../../../shared/services/api.service';
import {provideMockApiService} from '../../../shared/test-util/test-util';
import {MailConfirmationComponent} from './mail-confirmation.component';

describe('MailConfirmationComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MailConfirmationComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideMockApiService()
      ]
    }).compileComponents();


  }));

  it('should create', () => {
    const fixture = TestBed.createComponent(MailConfirmationComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should redirect to /login on ngOnInit if api-call sucessful', () => {
    TestBed.overrideProvider(ApiService, provideMockApiService());
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.overrideProvider(Router, {useValue: routerSpy});
    const apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    apiServiceSpy.get.and.returnValue(of({}));
    const fixture = TestBed.createComponent(MailConfirmationComponent);
    fixture.detectChanges();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tabs/login'], {queryParams: {emailConfirmed: true}});
  });

  it('should not redirect to /login on ngOnInit if api-call failed', () => {
    TestBed.overrideProvider(ApiService, provideMockApiService());
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.overrideProvider(Router, {useValue: routerSpy});
    const apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    apiServiceSpy.get.and.returnValue(throwError(() => new Error('Error')));
    const fixture = TestBed.createComponent(MailConfirmationComponent);
    fixture.detectChanges();
    expect(routerSpy.navigate).not.toHaveBeenCalledWith(['/tabs/login'], {queryParams: {emailConfirmed: true}});
  });
});
