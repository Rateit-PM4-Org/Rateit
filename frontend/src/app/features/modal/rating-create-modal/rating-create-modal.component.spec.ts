import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RatingCreateModalComponent } from './rating-create-modal.component';
import { provideHttpClient } from '@angular/common/http';
import { RitService } from '../../../shared/services/rit.service';
import { of } from 'rxjs';

describe('RatingCreateModalComponent', () => {
  let component: RatingCreateModalComponent;
  let fixture: ComponentFixture<RatingCreateModalComponent>;
  let ritServiceSpy: jasmine.SpyObj<RitService>;

  beforeEach(async () => {
    ritServiceSpy = jasmine.createSpyObj('RitService', ['createRit', 'getRits', 'getRitsErrorStream']);
    ritServiceSpy.getRits.and.returnValue(of([]));
    ritServiceSpy.getRitsErrorStream.and.returnValue(of({}));
    TestBed.configureTestingModule({
      imports: [RatingCreateModalComponent],
      providers: [
        provideHttpClient(),
        { provide: RitService, useValue: ritServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RatingCreateModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
