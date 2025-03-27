import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { first, of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    authService = TestBed.inject(AuthService);
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a new user', () => {
    const mockResponse = { success: true };
    const registrationData = { email: 'test@example.com', displayName: 'Test User', password: 'password123' };

    service.register(registrationData.email, registrationData.displayName, registrationData.password).pipe(first()).subscribe(response => {
      expect(response).toEqual(mockResponse);
      
    })

    const req = httpMock.expectOne(`${environment.apiUrl}/user/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(registrationData);
    req.flush(mockResponse);
  });
});