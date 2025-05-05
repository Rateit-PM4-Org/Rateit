import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AllRitsComponent } from './all-rits.component';
import { UserService } from '../../../shared/services/user.service';
import { RitService } from '../../../shared/services/rit.service';
import { provideHttpClient } from '@angular/common/http';
import { Rit } from '../../../model/rit';
import { of, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { RatingComparisonOperator } from '../../../shared/services/rit-filter.service';

const userServiceMock = {
  isLoggedIn: () => of(true)
};

describe('AllRitsComponent', () => {
  let component: AllRitsComponent;
  let fixture: ComponentFixture<AllRitsComponent>;
  let ritServiceSpy: jasmine.SpyObj<RitService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(waitForAsync(() => {
    ritServiceSpy = jasmine.createSpyObj('RitService', ['getRits', 'getRitsErrorStream']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    ritServiceSpy.getRits.and.returnValue(of([]));
    ritServiceSpy.getRitsErrorStream.and.returnValue(of({}));

    TestBed.configureTestingModule({
      imports: [AllRitsComponent, IonicModule.forRoot()],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: RitService, useValue: ritServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({})
          }
        },
        { provide: Router, useValue: routerSpy },
        provideHttpClient()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AllRitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load rits on initialization', () => {
    const mockRits: Rit[] = [
      { id: '1', name: 'Test Rit 1', details: 'Details 1', tags: ['tag1'], codes: ['code1'] },
      { id: '2', name: 'Test Rit 2', details: 'Details 2', tags: ['tag2'], codes: ['code2'] }
    ];
    ritServiceSpy.getRits.and.returnValue(of(mockRits));

    component.ionViewWillEnter();

    expect(component.rits).toEqual(mockRits);
  });

  it('should show previous rits list when loading rits fails', () => {
    const mockError = { error: { error: 'Failed to load rits' } };
    ritServiceSpy.getRits.and.returnValue(throwError(() => mockError));

    component.ionViewWillEnter();

    expect(component.rits).toEqual([]);
  });

  it('should show error toast on error', async () => {
    spyOn(component, 'showErrorToast');

    const mockError = { error: { error: 'Failed to load rits' } };
    ritServiceSpy.getRits.and.returnValue(throwError(() => mockError));

    component.ionViewWillEnter();

    expect(component.showErrorToast).toHaveBeenCalledWith('Failed to load rits');
  });

  it('should update URL when adding a tag filter', () => {
    component.addTagToFilter('newTag');

    expect(routerSpy.navigate).toHaveBeenCalledWith(
      [],
      jasmine.objectContaining({
        queryParams: jasmine.objectContaining({ tag: ['newTag'] })
      })
    );
    expect(component.filterOptions.tags).toEqual(['newTag']);
  });

  it('should clear URL parameters when clearing all filters except search', () => {
    component.filterOptions.tags = ['someTag'];
    component.filterOptions.searchText = 'someSearch';

    component.clearFilters();

    expect(routerSpy.navigate).toHaveBeenCalledWith(
      [],
      jasmine.objectContaining({
        queryParams: {search: 'someSearch'}
      })
    );
    expect(component.filterOptions.tags).toEqual([]);
    expect(component.filterOptions.searchText).toBe('someSearch');
  });

  it('should remove only tag parameter when clearing tag filter', () => {
    component.filterOptions.tags = ['someTag'];
    component.filterOptions.searchText = 'someSearch';

    component.clearTagFilter();

    expect(routerSpy.navigate).toHaveBeenCalled();
    expect(component.filterOptions.tags).toEqual([]);
    expect(component.filterOptions.searchText).toBe('someSearch');
  });

  it('should add a tag to existing tags when addTagToFilter is called', () => {
    component.filterOptions.tags = ['existingTag'];
    component.addTagToFilter('newTag');

    expect(routerSpy.navigate).toHaveBeenCalledWith(
      [],
      jasmine.objectContaining({
        queryParams: jasmine.objectContaining({ tag: ['existingTag', 'newTag'] })
      })
    );
    expect(component.filterOptions.tags).toEqual(['existingTag', 'newTag']);
  });

  it('should not add duplicate tags when addTagToFilter is called with existing tag', () => {
    component.filterOptions.tags = ['existingTag'];
    component.addTagToFilter('existingTag');

    expect(component.filterOptions.tags).toEqual(['existingTag']);
    expect(routerSpy.navigate).not.toHaveBeenCalledWith(
      [],
      jasmine.objectContaining({
        queryParams: jasmine.objectContaining({ tag: ['existingTag', 'existingTag'] })
      })
    );
  });

  it('should remove a specific tag when removeTagFromFilter is called', () => {
    component.filterOptions.tags = ['tag1', 'tag2', 'tag3'];
    component.removeTagFromFilter('tag2');

    expect(routerSpy.navigate).toHaveBeenCalledWith(
      [],
      jasmine.objectContaining({
        queryParams: jasmine.objectContaining({ tag: ['tag1', 'tag3'] })
      })
    );
    expect(component.filterOptions.tags).toEqual(['tag1', 'tag3']);
  });

  it('should update URL when setting a rating filter', () => {
    component.setRatingFilter(4);

    expect(routerSpy.navigate).toHaveBeenCalledWith(
      [],
      jasmine.objectContaining({
        queryParams: jasmine.objectContaining({
          rating: 4,
          ratingOp: RatingComparisonOperator.GreaterThanOrEqual
        })
      })
    );
    expect(component.filterOptions.rating).toBe(4);
  });

  it('should toggle off rating filter when clicking the same value', () => {
    component.filterOptions.rating = 3;
    component.setRatingFilter(3);

    expect(routerSpy.navigate).toHaveBeenCalledWith(
      [],
      jasmine.objectContaining({
        queryParams: {}
      })
    );
    expect(component.filterOptions.rating).toBe(0);
  });

  it('should update URL when changing rating operator', () => {
    component.filterOptions.rating = 3;
    component.setRatingOperator(RatingComparisonOperator.Equal);

    expect(routerSpy.navigate).toHaveBeenCalledWith(
      [],
      jasmine.objectContaining({
        queryParams: jasmine.objectContaining({
          rating: 3,
          ratingOp: component.filterOptions.ratingOperator
        })
      })
    );
    expect(component.filterOptions.ratingOperator).toBe(RatingComparisonOperator.Equal);
  });

  it('should reset rating filter when changing to the same operator', () => {
    component.filterOptions.rating = 3;
    component.filterOptions.ratingOperator = RatingComparisonOperator.GreaterThanOrEqual;
    component.setRatingOperator(RatingComparisonOperator.GreaterThanOrEqual);

    expect(routerSpy.navigate).toHaveBeenCalledWith(
      [],
      jasmine.objectContaining({
        queryParams: {}
      })
    );
    expect(component.filterOptions.rating).toBe(0);
    expect(component.filterOptions.ratingOperator).toBe(RatingComparisonOperator.GreaterThanOrEqual);
  });

  it('should clear rating filter when clearRatingFilter is called', () => {
    component.filterOptions.rating = 3;
    component.clearRatingFilter();

    expect(routerSpy.navigate).toHaveBeenCalledWith(
      [],
      jasmine.objectContaining({
        queryParams: {}
      })
    );
    expect(component.filterOptions.rating).toBe(0);
  });

  it('should call addTagToFilter when handleTagClick is called', () => {
    spyOn(component, 'addTagToFilter');
    const event = new Event('click');

    component.handleTagClick('testTag', event);

    expect(component.addTagToFilter).toHaveBeenCalledWith('testTag');
  });

  it('should prevent event propagation when handleTagClick is called', () => {
    const event = jasmine.createSpyObj('Event', ['stopPropagation']);

    component.handleTagClick('testTag', event as unknown as Event);

    expect(event.stopPropagation).toHaveBeenCalled();
  });

  it('should read query parameters from URL on initialization', () => {
    TestBed.resetTestingModule();

    // Setup with specific query params
    TestBed.configureTestingModule({
      imports: [AllRitsComponent, IonicModule.forRoot()],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: RitService, useValue: ritServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({ tag: 'testTag', search: 'testSearch' })
          }
        },
        { provide: Router, useValue: routerSpy },
        provideHttpClient()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AllRitsComponent);
    component = fixture.componentInstance;

    component.ionViewWillEnter();

    expect(component.filterOptions.tags).toEqual(['testTag']);
    expect(component.filterOptions.searchText).toBe('testSearch');
  });
});
