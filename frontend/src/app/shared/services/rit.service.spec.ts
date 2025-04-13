import { TestBed } from '@angular/core/testing';
import { provideMockApiService, provideMockAuthService } from '../test-util/test-util';
import { RitService } from './rit.service';
import { ApiService } from './api.service';
import { first, of, skip, throwError, Subject } from 'rxjs';
import { Rit } from '../../model/rit';
import { AuthService } from './auth.service';

describe('RitService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RitService,
        provideMockAuthService(false),
        provideMockApiService()
      ]
    });

  });

  it('should be created', () => {
    let service = TestBed.inject(RitService);
    expect(service).toBeTruthy();
  });

  it('should create a new rit', () => {
    let service = TestBed.inject(RitService);
    const apiServiceSpy = (TestBed.inject(ApiService)) as jasmine.SpyObj<ApiService>;
    apiServiceSpy.post.and.returnValue(of({ success: true }));
    const mockResponse = { success: true };
    const rit: Rit = { name: 'testRit', details: 'some details', tags: ['tag1', 'tag2'] };

    service.createRit(rit).pipe(first()).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(apiServiceSpy.post).toHaveBeenCalledWith('/rit/create', rit);
      expect(apiServiceSpy.post).toHaveBeenCalledTimes(1);
    });
  });

  it('should initialize getRits as an empty array if unauthenticated', (done) => {
    let service = TestBed.inject(RitService);
    service.getRits().pipe(first()).subscribe(rits => {
      expect(rits).toEqual([]);
      done();
    });
  });


  it('should load getRits with API-Data if authenticated', (done) => {
    TestBed.overrideProvider(AuthService, provideMockAuthService(true));
    const apiServiceSpy = (TestBed.inject(ApiService)) as jasmine.SpyObj<ApiService>;
    const mockRits = [{ name: 'testRit', details: 'some details', tags: ['tag1', 'tag2'] }];
    apiServiceSpy.get.and.returnValue(of(mockRits));
    let service = TestBed.inject(RitService);
    service.getRits().pipe(first()).subscribe(rits => {
      expect(rits).toEqual(mockRits);
      done();
    });
  }
  );

  it('should update getRits on triggerRitsReload', (done) => {
    let service = TestBed.inject(RitService);
    const apiServiceSpy = (TestBed.inject(ApiService)) as jasmine.SpyObj<ApiService>;
    const mockRits = [{ name: 'testRit', details: 'some details', tags: ['tag1', 'tag2'] }];
    apiServiceSpy.get.and.returnValue(of(mockRits));
    service.getRits().pipe(skip(1)).subscribe(rits => {
      expect(rits).toEqual(mockRits);
      done();
    });
    service.triggerRitsReload().subscribe({})
  });

  it('should update getRits on triggerRitsReload with empty array', (done) => {
    let service = TestBed.inject(RitService);
    const apiServiceSpy = (TestBed.inject(ApiService)) as jasmine.SpyObj<ApiService>;
    const mockRits: Rit[] = [];
    apiServiceSpy.get.and.returnValue(of(mockRits));
    service.getRits().pipe(skip(1)).subscribe(rits => {
      expect(rits).toEqual(mockRits);
      done();
    });
    service.triggerRitsReload().subscribe({})
  });

  it('error stream next should be called on API error', (done) => {
    let service = TestBed.inject(RitService);
    const apiServiceSpy = (TestBed.inject(ApiService)) as jasmine.SpyObj<ApiService>;
    apiServiceSpy.get.and.returnValue(throwError(() => {
      return { error: 'Error loading rits' }
    }));

    service.getRitsErrorStream().subscribe(
      err => {
        expect(err).toEqual({
          error: {
            error: 'Error loading Rits',
            code: 'RITS_FETCH_FAIL'
          }
        });
        done();
      }
    );

    // Trigger the reload to invoke the error
    service.triggerRitsReload().subscribe({
      error: () => { } // Handle error to avoid unhandled rejection
    });
  });

  it('should trigger rits reload when user becomes authenticated', () => {
    const authServiceMock = {
      getAuthenticationStatusObservable: jasmine.createSpy().and.returnValue(of(true))
    };

    spyOn(RitService.prototype, 'triggerRitsReload').and.returnValue(of([]));

    TestBed.configureTestingModule({
      providers: [
        RitService,
        { provide: AuthService, useValue: authServiceMock },
        provideMockApiService()
      ]
    });

    const service = TestBed.inject(RitService);
    expect(service.triggerRitsReload).toHaveBeenCalled();
  });

  it('should reset rits to empty array when user becomes unauthenticated', (done) => {
    const authSubject = new Subject<boolean>();
    const authServiceMock = {
      getAuthenticationStatusObservable: jasmine.createSpy().and.returnValue(authSubject.asObservable())
    };

    TestBed.configureTestingModule({
      providers: [
        RitService,
        { provide: AuthService, useValue: authServiceMock },
        provideMockApiService()
      ]
    });

    const service = TestBed.inject(RitService);
    const apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;

    // First set some data by faking being authenticated
    const mockRits = [{ name: 'testRit', details: 'details', tags: ['tag'] }];
    apiServiceSpy.get.and.returnValue(of(mockRits));

    // Send authenticated=true
    authSubject.next(true);

    // Verify data is loaded
    service.getRits().pipe(first()).subscribe(rits => {
      expect(rits).toEqual(mockRits);

      // Now simulate logout
      authSubject.next(false);

      // Verify data is cleared
      service.getRits().pipe(first()).subscribe(emptyRits => {
        expect(emptyRits).toEqual([]);
        done();
      });
    });
  });

  it('should handle error when creating a rit', (done) => {
    let service = TestBed.inject(RitService);
    const apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;

    const mockError = { error: 'Failed to create rit' };
    apiServiceSpy.post.and.returnValue(throwError(() => mockError));

    const rit: Rit = { name: 'testRit', details: 'some details', tags: ['tag1'] };

    service.createRit(rit).subscribe({
      error: err => {
        expect(err).toEqual(mockError);
        expect(apiServiceSpy.post).toHaveBeenCalledWith('/rit/create', rit);
        done();
      }
    });
  });

  it('should reload rits without emitting errors on successful reload', (done) => {
    let service = TestBed.inject(RitService);
    const apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    
    const mockRits = [{ name: 'newRit', details: 'fresh details', tags: ['tag3', 'tag4'] }];
    apiServiceSpy.get.and.returnValue(of(mockRits));
    
    const errorSpy = jasmine.createSpy('errorSpy');
    service.getRitsErrorStream().subscribe(errorSpy);
    
    service.getRits().pipe(skip(1)).subscribe(rits => {
      expect(rits).toEqual(mockRits);
      
      expect(errorSpy).not.toHaveBeenCalled();
      done();
    });
    
    service.triggerRitsReload().subscribe();
  });

});