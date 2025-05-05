import { TestBed } from '@angular/core/testing';

import { RitFilterService } from './rit-filter.service';

describe('RitFilterService', () => {
  let service: RitFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RitFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
