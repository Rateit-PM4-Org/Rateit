import { TestBed } from '@angular/core/testing';
import { provideMockApiService, provideMockAuthService } from '../test-util/test-util';
import { RitService } from './rit.service';

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


});