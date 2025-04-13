import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserService } from '../../../shared/services/user.service';
import { provideHttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import {RatingService} from '../../../shared/services/rating.service';
import {AllRatingsComponent} from './all-ratings.component';
import {Rating} from '../../../model/rating';

const userServiceMock = {
  isLoggedIn: () => of(true)
};

describe('AllRatingsComponent', () => {
  let component: AllRatingsComponent;
  let fixture: ComponentFixture<AllRatingsComponent>;
  let ratingServiceSpy: jasmine.SpyObj<RatingService>;

  beforeEach(waitForAsync(() => {
    ratingServiceSpy = jasmine.createSpyObj('RatingService', ['getAllRatings']);
    ratingServiceSpy.getAllRatings.and.returnValue(of([]));

    TestBed.configureTestingModule({
      imports: [AllRatingsComponent, IonicModule.forRoot()],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: RatingService, useValue: ratingServiceSpy },
        provideHttpClient()
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
      { id: '1', value: 1 },
      { id: '2', value: 2 }
    ];
    ratingServiceSpy.getAllRatings.and.returnValue(of(mockRatings));

    component.ionViewWillEnter();

    expect(component.ratings).toEqual(mockRatings);
  });

  it('should handle show empty list when loading ratings fails', () => {
    const mockError = { error: { error: 'Failed to load ratings' } };
    ratingServiceSpy.getAllRatings.and.returnValue(throwError(() => mockError));

    component.ionViewWillEnter();

    expect(component.ratings).toEqual([]);
  });

  it('should show error toast on error', async () => {
    spyOn(component, 'showErrorToast');

    const mockError = { error: { error: 'Failed to load ratings' } };
    ratingServiceSpy.getAllRatings.and.returnValue(throwError(() => mockError));

    component.ionViewWillEnter();

    expect(component.showErrorToast).toHaveBeenCalledWith('Failed to load ratings');
  });
});
