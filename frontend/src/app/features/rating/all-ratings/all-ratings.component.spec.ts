import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserService } from '../../../shared/services/user.service';
import { provideHttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import {AllRatingsComponent} from './all-ratings.component';
import {Rating} from '../../../model/rating';
import { ActivatedRoute } from '@angular/router';
import { RitService } from '../../../shared/services/rit.service';
import { Rit } from '../../../model/rit';

const userServiceMock = {
  isLoggedIn: () => of(true)
};

describe('AllRatingsComponent', () => {
  let component: AllRatingsComponent;
  let fixture: ComponentFixture<AllRatingsComponent>;
  let ritServiceSpy: jasmine.SpyObj<RitService>;

  beforeEach(waitForAsync(() => {
    ritServiceSpy = jasmine.createSpyObj('RitService', ['getRitById', 'getRitsErrorStream']);
    ritServiceSpy.getRitsErrorStream.and.returnValue(of({}));


    TestBed.configureTestingModule({
      imports: [AllRatingsComponent, IonicModule.forRoot()],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: RitService, useValue: ritServiceSpy },
        provideHttpClient(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { ritId: '1' }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AllRatingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load ratings on initialization', () => {
    const mockRatings: Rating[] = [
      { id: '1', value: 5 },
      { id: '2', value: 4 }
    ];
    const mockRit: Rit = {
      id: '1',
      name: 'Test Rit',
      details: 'Details',
      tags: ['tag1'],
      ratings: mockRatings
    };

    ritServiceSpy.getRitById.and.returnValue(of(mockRit));

    component.ionViewWillEnter();

    expect(component.ratings).toEqual(mockRatings);
  });

  it('should handle show empty list when loading ratings fails', () => {
    const mockError = { error: { error: 'Failed to load ratings' } };
    ritServiceSpy.getRitById.and.returnValue(throwError(() => mockError));

    component.ionViewWillEnter();

    expect(component.ratings).toEqual([]);
  });

  it('should show error toast on error', async () => {
    spyOn(component, 'showErrorToast');

    const mockError = { error: { error: 'Failed to load ratings' } };
    ritServiceSpy.getRitById.and.returnValue(throwError(() => mockError));

    component.ionViewWillEnter();

    expect(component.showErrorToast).toHaveBeenCalledWith('Failed to load ratings');
  });

  it('should delete a rating successfully', () => {
    const ratingId = '1';

    ritServiceSpy.deleteRating = jasmine.createSpy().and.returnValue(of({}));
    ritServiceSpy.triggerRitsReload = jasmine.createSpy().and.returnValue(of({}));
    spyOn(component, 'loadRatings');
    spyOn(component, 'showSuccessToast');

    component.deleteRating(ratingId);

    expect(ritServiceSpy.deleteRating).toHaveBeenCalledWith(ratingId);
    expect(ritServiceSpy.triggerRitsReload).toHaveBeenCalled();
    expect(component.loadRatings).toHaveBeenCalledWith('1');
    expect(component.showSuccessToast).toHaveBeenCalledWith('Rating deleted successfully!');
  });

});
