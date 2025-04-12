import { TestBed } from '@angular/core/testing';
import { provideMockApiService, provideMockAuthService } from '../test-util/test-util';
import { RitService } from './rit.service';
import { ApiService } from './api.service';
import { first, of } from 'rxjs';
import { Rit } from '../../model/rit';

describe('RitService', () => {
  let service: RitService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RitService,
        provideMockAuthService(true),
        provideMockApiService()
      ]
    });
    service = TestBed.inject(RitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a new rit', () => {
      const apiServiceSpy = (TestBed.inject(ApiService)) as jasmine.SpyObj<ApiService>;
      apiServiceSpy.post.and.returnValue(of({ success: true }));
      const mockResponse = { success: true };
      const rit: Rit = { name: 'testRit', details: 'some details', tags: ['tag1', 'tag2'] };
  
      service.createRit(rit).pipe(first()).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });
    });


});