import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { IonicModule } from '@ionic/angular';
import { ActionSheetController, ToastController } from '@ionic/angular/standalone';
import { of, throwError } from 'rxjs';
import { RitService } from '../../../shared/services/rit.service';
import { UserService } from '../../../shared/services/user.service';
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
    const ritSpy = jasmine.createSpyObj('RitService', ['createRit']);
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
        { provide: RitService, useValue: ritSpy },
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
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('ion-title');
    expect(title?.textContent).toContain('Home');
  });

  it('should call createRit and show success toast on success', fakeAsync(() => {
    const toast = { present: jasmine.createSpy() };
    toastControllerSpy.create.and.returnValue(Promise.resolve(toast as any));

    component.modal = { dismiss: jasmine.createSpy() } as any;

    component.ritCreateComponent = {
      ritName: 'Test Rit',
      details: 'Details',
      tags: ['tag1']
    } as any;

    ritServiceSpy.createRit.and.returnValue(of({}));

    component.confirm();
    tick();

    expect(ritServiceSpy.createRit).toHaveBeenCalled();
    expect(component.modal.dismiss).toHaveBeenCalledWith(null, 'confirm');
    expect(toastControllerSpy.create).toHaveBeenCalledWith(jasmine.objectContaining({ message: 'Rit created successfully!' }));
    expect(toastControllerSpy.create).toHaveBeenCalledWith(jasmine.objectContaining({ color: 'success' }));
    expect(toast.present).toHaveBeenCalled();
  }));

  it('should call createRit and show error toast on error', fakeAsync(() => {
    const toast = { present: jasmine.createSpy() };
    toastControllerSpy.create.and.returnValue(Promise.resolve(toast as any));

    component.modal = { dismiss: jasmine.createSpy() } as any;

    component.ritCreateComponent = {
      ritName: '',
      details: 'Details',
      tags: ['tag1']
    } as any;

    const mockErrorResponse = {
      error: {
        error: 'Validation failed',
        fields: {
          ritName: ['must not be empty']
        }
      }
    };

    ritServiceSpy.createRit.and.returnValue(throwError(() => mockErrorResponse));

    component.confirm();
    tick();

    expect(component.errorMessage).toContain('Validation failed');
    expect(component.errorMessage).toContain('- ritName: must not be empty');
    expect(toastControllerSpy.create).toHaveBeenCalledWith(jasmine.objectContaining({ color: 'danger' }));
    expect(toast.present).toHaveBeenCalled();
  }));

  it('should call modal.dismiss with null and "cancel" when Cancel button logic is used', async () => {
    let dismissCalled = false;
    let receivedData = null;
    let receivedRole = '';

    component.modal = {
      dismiss: async (data: any, role: string) => {
        dismissCalled = true;
        receivedData = data;
        receivedRole = role;
      }
    } as any;

    await component.modal.dismiss(null, 'cancel');

    expect(dismissCalled).toBeTrue();
    expect(receivedData).toBeNull();
    expect(receivedRole).toBe('cancel');
  });

  it('canDismiss returns true if role is not cancel', async () => {
    const result = await component.canDismiss({}, 'confirm');
    expect(result).toBeTrue();
  });

  it('canDismiss returns true if actionSheet returns confirm', async () => {
    const present = jasmine.createSpy().and.returnValue(Promise.resolve());
    const onWillDismiss = jasmine.createSpy().and.returnValue(Promise.resolve({ role: 'confirm' }));
    actionSheetControllerSpy.create.and.returnValue(Promise.resolve({
      present,
      onWillDismiss
    } as any));

    const result = await component.canDismiss({}, 'cancel');
    expect(result).toBeTrue();
    expect(present).toHaveBeenCalled();
    expect(onWillDismiss).toHaveBeenCalled();
  });

  it('canDismiss returns false if actionSheet returns cancel', async () => {
    const present = jasmine.createSpy().and.returnValue(Promise.resolve());
    const onWillDismiss = jasmine.createSpy().and.returnValue(Promise.resolve({ role: 'cancel' }));
    actionSheetControllerSpy.create.and.returnValue(Promise.resolve({
      present,
      onWillDismiss
    } as any));

    const result = await component.canDismiss({}, 'cancel');
    expect(result).toBeFalse();
  });

  it('should render ion-fab-button when logged in', async () => {
    fixture.detectChanges();

    const fabButton = fixture.nativeElement.querySelector('[data-testid="rit-create-button"]');
    expect(fabButton).toBeTruthy();
  });

  it('should not render ion-fab-button when not logged in', async () => {
    userServiceMock.isLoggedIn = () => of(false);

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const fabButton = fixture.nativeElement.querySelector('[data-testid="rit-create-button"]');
    expect(fabButton).toBeFalsy();

    userServiceMock.isLoggedIn = () => of(true)
  });

});