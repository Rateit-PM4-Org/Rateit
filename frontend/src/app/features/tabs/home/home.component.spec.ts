import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { IonicModule } from '@ionic/angular';
import { ActionSheetController, ToastController } from '@ionic/angular/standalone';
import { of, throwError } from 'rxjs';
import { RitService } from '../../../shared/services/rit.service';
import { UserService } from '../../../shared/services/user.service';
import { RitCreateComponent } from '../../rit/rit-create/rit-create.component';
import { HomeComponent } from './home.component';

const userServiceMock = {
  isLoggedIn: () => of(true)
};

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let ritServiceSpy: jasmine.SpyObj<RitService>;
  let toastControllerSpy: jasmine.SpyObj<ToastController>;
  let actionSheetControllerSpy: jasmine.SpyObj<ActionSheetController>;

  beforeEach(async () => {
    ritServiceSpy = jasmine.createSpyObj('RitService', ['createRit', 'getRits', 'getRitsErrorStream']);
    ritServiceSpy.getRits.and.returnValue(of([]));
    ritServiceSpy.getRitsErrorStream.and.returnValue(of({}));
    const toastSpy = jasmine.createSpyObj('ToastController', ['create']);
    const actionSheetSpy = jasmine.createSpyObj('ActionSheetController', ['create']);

    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        IonicModule.forRoot(),
        NoopAnimationsModule
      ],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: RitService, useValue: ritServiceSpy },
        { provide: ToastController, useValue: toastSpy },
        { provide: ActionSheetController, useValue: actionSheetSpy },
        provideHttpClient()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    ritServiceSpy = TestBed.inject(RitService) as jasmine.SpyObj<RitService>;
    toastControllerSpy = TestBed.inject(ToastController) as jasmine.SpyObj<ToastController>;
    actionSheetControllerSpy = TestBed.inject(ActionSheetController) as jasmine.SpyObj<ActionSheetController>;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should render "Home" in ion-title', () => {
    fixture.componentInstance.ionViewWillEnter();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('ion-title');
    expect(title?.textContent).toContain('Home');
  });

  it('should return the latest 10 rits sorted by lastInteractionAt descending', () => {
    const now = new Date().getTime();
    const ritsMock = Array.from({ length: 15 }, (_, i) => ({
      name: `rit-${i}`,
      details: '',
      tags: [],
      lastInteractionAt: now + i * 1000
    })) as any[];
  
    component['rits'] = ritsMock;
    component.numberOfLatestRitsToShow = 10;
  
    const latest = component.latestRits();
  
    expect(latest.length).toBe(10);
    expect(latest[0].name).toBe('rit-0');
    expect(latest[9].name).toBe('rit-9');
  });

  it('should return 10 latest rits when more than 10 are available', () => {
    const now = new Date();
    const rits = Array.from({ length: 20 }, (_, i) => ({
      id: i.toString(),
      name: `Rit ${i}`,
      details: `Details ${i}`,
      tags: [],
      lastInteractionAt: new Date(now.getTime() - i * 1000).toISOString(),
    }));
  
    ritServiceSpy.getRits = jasmine.createSpy().and.returnValue(of(rits));
    component.ionViewWillEnter();
  
    expect(component.latestRits().length).toBe(10);
  });

  it('should show error toast on error', async () => {
    spyOn(component, 'showErrorToast');

    const mockError = { error: { error: 'Failed to load rits' } };
    ritServiceSpy.getRits = jasmine.createSpy().and.returnValue(throwError(() => mockError));

    component.ionViewWillEnter();

    expect(component.showErrorToast).toHaveBeenCalledWith('Failed to load rits');
  });

  it('should render the Show all button for rits', () => {
    fixture.componentInstance.ionViewWillEnter();
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('[data-testid="show-all-rits"]');
    expect(button).toBeTruthy();
  });
  
  it('should call goToRitsTab() when Show all button is clicked', () => {
    fixture.componentInstance.ionViewWillEnter();
    fixture.detectChanges();
    
    spyOn(component, 'goToRitsTab');
    const button = fixture.nativeElement.querySelector('[data-testid="show-all-rits"]');
    button.click();
    expect(component.goToRitsTab).toHaveBeenCalled();
  });

  it('should handle refresh event and show success toast on successful reload', fakeAsync(() => {
    // Mock the refresher element
    const mockEvent = {
      target: {
        complete: jasmine.createSpy('complete')
      }
    };
    
    // Mock the toast
    const toast = { present: jasmine.createSpy('present') };
    toastControllerSpy.create.and.returnValue(Promise.resolve(toast as any));
    
    // Setup ritService to return success
    ritServiceSpy.triggerRitsReload = jasmine.createSpy().and.returnValue(of({}));
    
    // Call the method
    component.handleRefresh(mockEvent as any);
    tick();
    
    // Verify the behavior
    expect(ritServiceSpy.triggerRitsReload).toHaveBeenCalled();
    expect(mockEvent.target.complete).toHaveBeenCalled();
    expect(toastControllerSpy.create).toHaveBeenCalledWith(
      jasmine.objectContaining({
        message: 'Rits loaded successfully!',
        color: 'success'
      })
    );
    expect(toast.present).toHaveBeenCalled();
  }));

  it('should handle refresh event and complete refresher on error', fakeAsync(() => {
    // Mock the refresher element
    const mockEvent = {
      target: {
        complete: jasmine.createSpy('complete')
      }
    };
    
    // Setup ritService to return error
    ritServiceSpy.triggerRitsReload = jasmine.createSpy().and.returnValue(
      throwError(() => new Error('Failed to reload'))
    );
    
    // Call the method
    component.handleRefresh(mockEvent as any);
    tick();
    
    // Verify the behavior - refresher should complete even on error
    expect(ritServiceSpy.triggerRitsReload).toHaveBeenCalled();
    expect(mockEvent.target.complete).toHaveBeenCalled();
    // Should not show success toast on error
    expect(toastControllerSpy.create).not.toHaveBeenCalledWith(
      jasmine.objectContaining({
        message: 'Rits loaded successfully!'
      })
    );
  }));

});