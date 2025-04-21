import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';

import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Rating } from '../../../model/rating';
import { Rit } from '../../../model/rit';
import { RitService } from '../../../shared/services/rit.service';
import { UserService } from '../../../shared/services/user.service';
import { AllRatingsComponent } from './all-ratings.component';

const userServiceMock = {
  isLoggedIn: () => of(true)
};

describe('AllRatingsComponent', () => {
  let component: AllRatingsComponent;
  let fixture: ComponentFixture<AllRatingsComponent>;
  let ritServiceSpy: jasmine.SpyObj<RitService>;
  let navControllerSpy = jasmine.createSpyObj('NavController', ['back']);

  beforeEach(waitForAsync(() => {
    ritServiceSpy = jasmine.createSpyObj('RitService', ['getRitById', 'getRitsErrorStream']);
    ritServiceSpy.getRitsErrorStream.and.returnValue(of({}));


    TestBed.configureTestingModule({
      imports: [AllRatingsComponent, IonicModule.forRoot()],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: RitService, useValue: ritServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
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

  it('should navigate back when goBack is called', () => {
    component.goBack();
    expect(navControllerSpy.back).toHaveBeenCalledWith({ animated: false });
  });

});
