import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { provideHttpClient } from '@angular/common/http';
import { first } from 'rxjs';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken', 'logout']);

    TestBed.configureTestingModule({
      providers: [
        ApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should perform a GET request with the correct headers', () => {
    authServiceSpy.getToken.and.returnValue('mock-token');
    const mockResponse = { data: 'test' };

    service.get('/test').pipe(first()).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/test`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
    req.flush(mockResponse);
  });

  it('should perform a POST request with the correct headers and body', () => {
    authServiceSpy.getToken.and.returnValue('mock-token');
    const mockBody = { key: 'value' };
    const mockResponse = { success: true };

    service.post('/test', mockBody).pipe(first()).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/test`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
    expect(req.request.body).toEqual(mockBody);
    req.flush(mockResponse);
  });

  it('should call AuthService.logout on 403 error for GET request', () => {
    authServiceSpy.getToken.and.returnValue('mock-token');
    service.get('/test').pipe(first()).subscribe({
      error: () => {
        expect(authServiceSpy.logout).toHaveBeenCalled();
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/test`);
    req.flush({}, { status: 403, statusText: 'Forbidden' });
  });

  it('should call AuthService.logout on 403 error for POST request', () => {
    authServiceSpy.getToken.and.returnValue('mock-token');
    const mockBody = { key: 'value' };

    service.post('/test', mockBody).pipe(first()).subscribe({
      error: () => {
        expect(authServiceSpy.logout).toHaveBeenCalled();
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/test`);
    req.flush({}, { status: 403, statusText: 'Forbidden' });
  });
});
