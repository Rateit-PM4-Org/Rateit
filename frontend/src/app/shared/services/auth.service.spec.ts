import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { provideHttpClient } from '@angular/common/http';
import { first } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and store the token', () => {
    const mockResponse = { token: 'mock-token' };
    const credentials = { email: 'test@example.com', password: 'password123' };

    service.login(credentials.email, credentials.password).pipe(first()).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(service.getToken()).toBe('mock-token');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/user/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);
    req.flush(mockResponse);
  });

  it('should logout and clear the token', () => {
    localStorage.setItem('token', 'mock-token');
    service.logout();
    expect(localStorage.getItem('token')).toBeNull();
    expect(service.getToken()).toBeNull();
  });
});