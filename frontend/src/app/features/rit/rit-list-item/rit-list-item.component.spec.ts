import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { RitListItemComponent } from './rit-list-item.component';
import { Rit } from '../../../model/rit';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular/standalone';
import { RitService } from '../../../shared/services/rit.service';
import {of, throwError} from 'rxjs';

describe('RitListItemComponent', () => {
  let component: RitListItemComponent;
  let fixture: ComponentFixture<RitListItemComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let navCtrlSpy: jasmine.SpyObj<NavController>;
  let ritServiceSpy: jasmine.SpyObj<RitService>;
  let toastControllerSpy: jasmine.SpyObj<ToastController>;

  const testRit: Rit = {
    id: '1',
    name: 'Test Rit',
    details: 'Some details',
    tags: ['tag1', 'tag2'],
  };

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate'], { url: '/tabs/rits' });
    navCtrlSpy = jasmine.createSpyObj('NavController', ['navigateForward']);
    toastControllerSpy = jasmine.createSpyObj('ToastController', ['create']);
    ritServiceSpy = jasmine.createSpyObj('RitService', ['deleteRit', 'triggerRitsReload']);

    await TestBed.configureTestingModule({
      imports: [RitListItemComponent, IonicModule.forRoot()],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: NavController, useValue: navCtrlSpy },
        { provide: ToastController, useValue: toastControllerSpy},
        { provide: RitService, useValue: ritServiceSpy },
        provideHttpClient(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RitListItemComponent);
    component = fixture.componentInstance;
    component.rit = testRit;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render rit name and tags', () => {
    const titleEl = fixture.debugElement.query(By.css('.title'))?.nativeElement;
    const chipElements = fixture.debugElement.queryAll(By.css('ion-chip'));

    expect(titleEl?.textContent).toContain(testRit.name);
    expect(chipElements.length).toBe(testRit.tags.length);
    chipElements.forEach((chipEl, index) => {
      expect(chipEl.nativeElement.textContent).toContain(testRit.tags[index]);
    });
  });

  it('should call navigateToRatings on button click', () => {
    spyOn(component, 'navigateToRatings');
    const button = fixture.debugElement.query(By.css('ion-button'));
    button.triggerEventHandler('click', null);
    expect(component.navigateToRatings).toHaveBeenCalled();
  });

  it('should calculate latest rating value correctly', () => {
    const ratings = [
      { id: '1', value: 4, createdAt: '2023-01-01' },
      { id: '2', value: 5, createdAt: '2023-02-01' },
    ];
    const latestRatingValue = component.calculateLatestRatingValue(ratings);
    expect(latestRatingValue).toBe(5);
  });

  it('should return 0 if no ratings are provided', () => {
    const latestRatingValue = component.calculateLatestRatingValue([]);
    expect(latestRatingValue).toBe(0);
  });

  it('should navigate to ratings with correct ID', () => {
    component.navigateToRatings();
    expect(navCtrlSpy.navigateForward).toHaveBeenCalledWith('/tabs/rits/ratings/1');
  });

  it('should navigate to rit view with correct ID', () => {
    component.navigateToRit();
    expect(navCtrlSpy.navigateForward).toHaveBeenCalledWith('/tabs/rits/view/1');
  });

  it('should navigate to rits-list with tagname', () => {
    component.navigateToTag('tag1', new Event('click'));
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tabs/rits'], {
      queryParams: { tag: 'tag1' }
    });
  });

  it('should show toast when rit is successfully deleted', async () => {
    ritServiceSpy.deleteRit.and.returnValue(of({}));
    ritServiceSpy.triggerRitsReload.and.returnValue(of([]));

    component.deleteRit(testRit.id);
    expect(ritServiceSpy.deleteRit).toHaveBeenCalledWith(testRit.id);
    expect(ritServiceSpy.triggerRitsReload).toHaveBeenCalled();
    expect(toastControllerSpy.create).toHaveBeenCalledWith({
      message: 'Rit deleted successfully!',
      duration: 2000,
      position: 'top',
      color: 'success',
    });
  });
  it('should show error toast on error', async () => {
    spyOn(component, 'showErrorToast');
    const mockError = { error: { error: 'Failed to delete rit' } };
    ritServiceSpy.deleteRit.and.returnValue(throwError(() => mockError));
    ritServiceSpy.triggerRitsReload.and.returnValue(of([]));
    component.deleteRit(testRit.id);
    expect(ritServiceSpy.deleteRit).toHaveBeenCalledWith(testRit.id);
    expect(ritServiceSpy.triggerRitsReload).toHaveBeenCalled();
    expect(component.showErrorToast).toHaveBeenCalledWith('Failed to delete rit');
  });
  it('should show error on error', async () => {
    const mockError = { error: { error: 'Failed to delete rit' } };
    ritServiceSpy.deleteRit.and.returnValue(throwError(() => mockError));
    ritServiceSpy.triggerRitsReload.and.returnValue(of([]));
    component.deleteRit(testRit.id);
    expect(ritServiceSpy.deleteRit).toHaveBeenCalledWith(testRit.id);
    expect(ritServiceSpy.triggerRitsReload).toHaveBeenCalled();

  });
});
