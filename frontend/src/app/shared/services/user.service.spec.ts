import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { first, of } from 'rxjs';
import { provideMockApiService, provideMockAuthService } from '../test-util/test-util';
import { ApiService } from './api.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService,
        provideMockAuthService(true),
        provideMockApiService()
      ]
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a new user', () => {
    const apiServiceSpy = (TestBed.inject(ApiService)) as jasmine.SpyObj<ApiService>;
    apiServiceSpy.post.and.returnValue(of({ success: true }));
    const mockResponse = { success: true };
    const registrationData = { email: 'test@example.com', displayName: 'Test User', password: 'password123' };

    service.register(registrationData.email, registrationData.displayName, registrationData.password).pipe(first()).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });
  });
  
});