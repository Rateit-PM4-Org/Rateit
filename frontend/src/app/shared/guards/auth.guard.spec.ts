import {TestBed} from '@angular/core/testing';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {AuthGuard} from './auth.guard';
import {AuthService} from '../services/auth.service';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideMockAuthService} from '../test-util/test-util';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthGuard,
        provideMockAuthService(false),
        {provide: Router, useValue: routerSpy}
      ]
    });

    authGuard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(authGuard).toBeTruthy();
  });

  it('should allow activation if user is authenticated', () => {
    const authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    authServiceSpy.isAuthenticated.and.returnValue(true);
    expect(authGuard.canActivate(new ActivatedRouteSnapshot(), <RouterStateSnapshot>{url: 'testUrl'})).toBeTrue();
  });

  it('should deny activation and redirect to login if user is not authenticated', () => {
    expect(authGuard.canActivate(new ActivatedRouteSnapshot(), <RouterStateSnapshot>{url: 'testUrl'})).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tabs/login'], Object({queryParams: Object({returnUrl: "testUrl"})}));
  });
});

