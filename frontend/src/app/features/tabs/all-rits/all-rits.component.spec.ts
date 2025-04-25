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
      { id: '1', name: 'Test Rit 1', details: 'Details 1', tags: ['tag1'] },
      { id: '2', name: 'Test Rit 2', details: 'Details 2', tags: ['tag2'] }
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
      { id: '1', name: 'Test Rit 1', details: 'Details 1', tags: ['tag1'] },
      { id: '2', name: 'Another Rit', details: 'Details 2', tags: ['tag2'] }
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
      { id: '1', name: 'Test Rit 1', details: 'Details 1', tags: ['tag1', 'common'] },
      { id: '2', name: 'Test Rit 2', details: 'Details 2', tags: ['tag2', 'common'] }
    ];
    component.selectedTag = 'tag1';

    const filteredRits = component.filteredRits();

    expect(filteredRits.length).toBe(1);
    expect(filteredRits[0].name).toBe('Test Rit 1');
  });

  it('should filter rits based on both search text and tag', () => {
    component.rits = [
      { id: '1', name: 'Test Rit 1', details: 'Details 1', tags: ['tag1'] },
      { id: '2', name: 'Test Rit 2', details: 'Details 2', tags: ['tag2'] },
      { id: '3', name: 'Another Rit', details: 'Details 3', tags: ['tag1'] }
    ];
    component.searchText = 'Test';
    component.selectedTag = 'tag1';

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
    
    expect(component.selectedTag).toBe('testTag');
    expect(component.searchText).toBe('testSearch');
  });

  it('should update URL when setting a tag filter', () => {
    component.setTagFilter('newTag');
    
    expect(routerSpy.navigate).toHaveBeenCalledWith(
      [],
      jasmine.objectContaining({
        queryParams: jasmine.objectContaining({ tag: 'newTag' })
      })
    );
    expect(component.selectedTag).toBe('newTag');
  });

  it('should clear URL parameters when clearing all filters', () => {
    component.selectedTag = 'someTag';
    component.searchText = 'someSearch';
    
    component.clearFilters();
    
    expect(routerSpy.navigate).toHaveBeenCalledWith(
      [],
      jasmine.objectContaining({
        queryParams: {}
      })
    );
    expect(component.selectedTag).toBe('');
    expect(component.searchText).toBe('');
  });

  it('should remove only tag parameter when clearing tag filter', () => {
    component.selectedTag = 'someTag';
    component.searchText = 'someSearch';
    
    component.clearTagFilter();
    
    expect(routerSpy.navigate).toHaveBeenCalled();
    expect(component.selectedTag).toBe('');
    expect(component.searchText).toBe('someSearch');
  });
});
