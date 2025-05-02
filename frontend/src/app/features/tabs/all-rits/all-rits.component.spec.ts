import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AllRitsComponent } from './all-rits.component';
import { UserService } from '../../../shared/services/user.service';
import { RitService } from '../../../shared/services/rit.service';
import { provideHttpClient } from '@angular/common/http';
import { Rit } from '../../../model/rit';
import { of, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

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

  it('should filter rits based on search text', () => {
    component.rits = [
      { id: '1', name: 'Test Rit 1', details: 'Details 1', tags: ['tag1'], codes: ['code1'] },
      { id: '2', name: 'Another Rit', details: 'Details 2', tags: ['tag2'], codes: ['code2'] }
    ];
    component.searchText = 'Test';

    const filteredRits = component.filteredRits();

    expect(filteredRits.length).toBe(1);
    expect(filteredRits[0].name).toBe('Test Rit 1');
  });

  it('should show error toast on error', async () => {
    spyOn(component, 'showErrorToast');

    const mockError = { error: { error: 'Failed to load rits' } };
    ritServiceSpy.getRits.and.returnValue(throwError(() => mockError));

    component.ionViewWillEnter();

    expect(component.showErrorToast).toHaveBeenCalledWith('Failed to load rits');
  });

  it('should filter rits based on selected tag', () => {
    component.rits = [
      { id: '1', name: 'Test Rit 1', details: 'Details 1', tags: ['tag1', 'common'], codes: ['code1'] },
      { id: '2', name: 'Test Rit 2', details: 'Details 2', tags: ['tag2', 'common'], codes: ['code2'] }
    ];
    component.selectedTags = ['tag1'];

    const filteredRits = component.filteredRits();

    expect(filteredRits.length).toBe(1);
    expect(filteredRits[0].name).toBe('Test Rit 1');
  });

  it('should filter rits based on both search text and tag', () => {
    component.rits = [
      { id: '1', name: 'Test Rit 1', details: 'Details 1', tags: ['tag1'], codes: ['code1'] },
      { id: '2', name: 'Test Rit 2', details: 'Details 2', tags: ['tag2'], codes: ['code2'] },
      { id: '3', name: 'Another Rit', details: 'Details 3', tags: ['tag1'], codes: ['code3'] }
    ];
    component.searchText = 'Test';
    component.selectedTags = ['tag1'];

    const filteredRits = component.filteredRits();

    expect(filteredRits.length).toBe(1);
    expect(filteredRits[0].name).toBe('Test Rit 1');
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

    expect(component.selectedTags).toEqual(['testTag']);
    expect(component.searchText).toBe('testSearch');
  });


  it('should update URL when adding a tag filter', () => {
    component.addTagToFilter('newTag');

    expect(routerSpy.navigate).toHaveBeenCalledWith(
      [],
      jasmine.objectContaining({
        queryParams: jasmine.objectContaining({ tag: ['newTag'] })
      })
    );
    expect(component.selectedTags).toEqual(['newTag']);
  });

  it('should clear URL parameters when clearing all filters', () => {
    component.selectedTags = ['someTag'];
    component.searchText = 'someSearch';

    component.clearFilters();

    expect(routerSpy.navigate).toHaveBeenCalledWith(
      [],
      jasmine.objectContaining({
        queryParams: {}
      })
    );
    expect(component.selectedTags).toEqual([]);
    expect(component.searchText).toBe('');
  });

  it('should remove only tag parameter when clearing tag filter', () => {
    component.selectedTags = ['someTag'];
    component.searchText = 'someSearch';

    component.clearTagFilter();

    expect(routerSpy.navigate).toHaveBeenCalled();
    expect(component.selectedTags).toEqual([]);
    expect(component.searchText).toBe('someSearch');
  });

  it('should read multiple tag parameters from URL on initialization', () => {
    TestBed.resetTestingModule();

    // Setup with multiple tag query params
    TestBed.configureTestingModule({
      imports: [AllRitsComponent, IonicModule.forRoot()],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: RitService, useValue: ritServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({ tag: ['tag1', 'tag2'], search: 'testSearch' })
          }
        },
        { provide: Router, useValue: routerSpy },
        provideHttpClient()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AllRitsComponent);
    component = fixture.componentInstance;

    component.ionViewWillEnter();

    expect(component.selectedTags).toEqual(['tag1', 'tag2']);
    expect(component.searchText).toBe('testSearch');
  });

  it('should add a tag to existing tags when addTagToFilter is called', () => {
    component.selectedTags = ['existingTag'];
    component.addTagToFilter('newTag');

    expect(routerSpy.navigate).toHaveBeenCalledWith(
      [],
      jasmine.objectContaining({
        queryParams: jasmine.objectContaining({ tag: ['existingTag', 'newTag'] })
      })
    );
    expect(component.selectedTags).toEqual(['existingTag', 'newTag']);
  });

  it('should not add duplicate tags when addTagToFilter is called with existing tag', () => {
    component.selectedTags = ['existingTag'];
    component.addTagToFilter('existingTag');

    expect(component.selectedTags).toEqual(['existingTag']);
    // Verify that router.navigate was not called again with the same tag
    expect(routerSpy.navigate).not.toHaveBeenCalledWith(
      [],
      jasmine.objectContaining({
        queryParams: jasmine.objectContaining({ tag: ['existingTag', 'existingTag'] })
      })
    );
  });

  it('should remove a specific tag when removeTagFromFilter is called', () => {
    component.selectedTags = ['tag1', 'tag2', 'tag3'];
    component.removeTagFromFilter('tag2');

    expect(routerSpy.navigate).toHaveBeenCalledWith(
      [],
      jasmine.objectContaining({
        queryParams: jasmine.objectContaining({ tag: ['tag1', 'tag3'] })
      })
    );
    expect(component.selectedTags).toEqual(['tag1', 'tag3']);
  });

  it('should filter rits that match all selected tags', () => {
    component.rits = [
      {
        id: '1', name: 'Rit 1', details: 'Details 1', tags: ['tag1', 'tag2', 'tag3'],
        codes: []
      },
      {
        id: '2', name: 'Rit 2', details: 'Details 2', tags: ['tag1', 'tag3'],
        codes: []
      },
      {
        id: '3', name: 'Rit 3', details: 'Details 3', tags: ['tag2', 'tag3'],
        codes: []
      }
    ];
    component.selectedTags = ['tag1', 'tag3'];

    const filteredRits = component.filteredRits();

    expect(filteredRits.length).toBe(2);
    expect(filteredRits[0].id).toBe('1');
    expect(filteredRits[1].id).toBe('2');
  });

  it('should show all rits when no tags are selected', () => {
    component.rits = [
      {
        id: '1', name: 'Rit 1', details: 'Details 1', tags: ['tag1'],
        codes: []
      },
      {
        id: '2', name: 'Rit 2', details: 'Details 2', tags: ['tag2'],
        codes: []
      }
    ];
    component.selectedTags = [];

    const filteredRits = component.filteredRits();

    expect(filteredRits.length).toBe(2);
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

    expect(component.selectedTags).toEqual(['testTag']);
    expect(component.searchText).toBe('testSearch');
  });

});
