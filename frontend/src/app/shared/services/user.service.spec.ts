import {TestBed} from '@angular/core/testing';
import {AuthState, UserService} from './user.service';
import {first, of, throwError} from 'rxjs';
import {provideMockApiService, provideMockAuthService} from '../test-util/test-util';
import {ApiService} from './api.service';

describe('UserService', () => {
  let service: UserService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        provideMockAuthService(true),
        provideMockApiService()
      ]
    });

    service = TestBed.inject(UserService);
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a new user', () => {
    const apiServiceSpy = (TestBed.inject(ApiService)) as jasmine.SpyObj<ApiService>;
    apiServiceSpy.post.and.returnValue(of({success: true}));
    const mockResponse = {success: true};
    const registrationData = {email: 'test@example.com', displayName: 'Test User', password: 'password123'};

    service.register(registrationData.email, registrationData.displayName, registrationData.password).pipe(first()).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });
  });

  it('should confirm email', () => {
    const apiServiceSpy = (TestBed.inject(ApiService)) as jasmine.SpyObj<ApiService>;
    apiServiceSpy.get.and.returnValue(of({success: true}));
    const mockResponse = {success: true};
    const email = 'email'
    const token = 'mock-token';

    service.confirmEmail(email, token).pipe(first()).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });
  });

  it('should set authState to AUTHENTICATED when profile is loaded', (done) => {
    apiServiceSpy.get.and.returnValue(of({name: 'Test User'}));

    (service as any).reloadProfile(); // Trigger the profile load

    service.getAuthState().pipe(first()).subscribe(state => {
      expect(state).toBe(AuthState.AUTHENTICATED);
      done();
    });
  });

  it('should set authState to NOT_AUTHENTICATED when profile loading fails', (done) => {
    apiServiceSpy.get.and.returnValue(throwError(() => new Error('Error loading profile')));

    (service as any).reloadProfile();

    service.getAuthState().pipe(first()).subscribe(state => {
      expect(state).toBe(AuthState.NOT_AUTHENTICATED);
      done();
    });
  });

  it('should return true if profile is set', (done) => {
    (service as any).profile.next({name: 'Test User'});

    service.isLoggedIn().pipe(first()).subscribe(result => {
      expect(result).toBeTrue();
      done();
    });
  });

  it('should return false if profile is null', (done) => {
    (service as any).profile.next(null);
    (service as any).profile.next(null);
    (service as any).authState.next(AuthState.NOT_AUTHENTICATED);

    service.isLoggedIn().pipe(first()).subscribe(result => {
      expect(result).toBeFalse();
      done();
    });
  });
});
