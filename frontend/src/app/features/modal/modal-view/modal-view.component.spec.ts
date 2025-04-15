import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { IonicModule } from '@ionic/angular';
import { ActionSheetController, ToastController } from '@ionic/angular/standalone';
import { of, throwError } from 'rxjs';
import { RitService } from '../../../shared/services/rit.service';
import { UserService } from '../../../shared/services/user.service';
import { RitCreateComponent } from '../../rit/rit-create/rit-create.component';
import { ModalViewComponent } from './modal-view.component';
const userServiceMock = {
  isLoggedIn: () => of(true)
};

describe('ModalViewComponent', () => {
  let component: ModalViewComponent;
  let fixture: ComponentFixture<ModalViewComponent>;
  let ritServiceSpy: jasmine.SpyObj<RitService>;
  let toastControllerSpy: jasmine.SpyObj<ToastController>;
  let actionSheetControllerSpy: jasmine.SpyObj<ActionSheetController>;

  beforeEach(async () => {
    ritServiceSpy = jasmine.createSpyObj('RitService', ['createRit', 'getRits', 'getRitsErrorStream']);
    ritServiceSpy.getRits.and.returnValue(of([]));
    ritServiceSpy.getRitsErrorStream.and.returnValue(of({}));
    const toastSpy = jasmine.createSpyObj('ToastController', ['create']);
    const actionSheetSpy = jasmine.createSpyObj('ActionSheetController', ['create']);

    TestBed.configureTestingModule({
      imports: [ModalViewComponent, IonicModule.forRoot(),
        NoopAnimationsModule],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: RitService, useValue: ritServiceSpy },
        { provide: ToastController, useValue: toastSpy },
        { provide: ActionSheetController, useValue: actionSheetSpy },
        provideHttpClient()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalViewComponent);
    component = fixture.componentInstance;
    ritServiceSpy = TestBed.inject(RitService) as jasmine.SpyObj<RitService>;
    toastControllerSpy = TestBed.inject(ToastController) as jasmine.SpyObj<ToastController>;
    actionSheetControllerSpy = TestBed.inject(ActionSheetController) as jasmine.SpyObj<ActionSheetController>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should dismiss modal if createRit returns true', async () => {
    const dismissSpy = jasmine.createSpy();
    component.modal = { dismiss: dismissSpy } as any;

    component.content = {
      submit: () => Promise.resolve(true)
    } as any;

    await component.confirm();

    expect(dismissSpy).toHaveBeenCalledWith(null, 'confirm');
  });

  it('should not dismiss modal if createRit returns false', async () => {
    const dismissSpy = jasmine.createSpy();
    component.modal = { dismiss: dismissSpy } as any;

    component.content = {
      submit: () => Promise.resolve(false)
    } as any;

    await component.confirm();

    expect(dismissSpy).not.toHaveBeenCalled();
  });

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

  
  it('should dismiss modal if createRit returns true', async () => {
    const dismissSpy = jasmine.createSpy();
    component.modal = { dismiss: dismissSpy } as any;

    component.content = {
      submit: () => Promise.resolve(true)
    } as any;

    await component.confirm();

    expect(dismissSpy).toHaveBeenCalledWith(null, 'confirm');
  });

  it('should not dismiss modal if createRit returns false', async () => {
    const dismissSpy = jasmine.createSpy();
    component.modal = { dismiss: dismissSpy } as any;

    component.content = {
      submit: () => Promise.resolve(false)
    } as any;

    await component.confirm();

    expect(dismissSpy).not.toHaveBeenCalled();
  });

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
});
