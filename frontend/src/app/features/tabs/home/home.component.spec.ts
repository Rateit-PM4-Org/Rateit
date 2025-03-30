import { TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { provideHttpClient } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home.component';
import { ActionSheetController } from '@ionic/angular/standalone';

describe('HomeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        IonicModule.forRoot(),
        NoopAnimationsModule
      ],
      providers: [provideHttpClient()]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render "Home" in ion-title', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('ion-title');
    expect(title?.textContent).toContain('Home');
  });

  it('confirm() should call modal.dismiss with correct data', async () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const component = fixture.componentInstance;

    component.ritCreateComponent = {
      ritName: 'TestRit',
      details: 'TestDetails',
      tags: ['x'],
      selectedImage: 'img.jpg',
    } as any;

    let dismissCalled = false;

    component.modal = {
      dismiss: async (data: any, role: string) => {
        dismissCalled = true;
        expect(role).toBe('confirm');
        expect(data).toEqual({
          name: 'TestRit',
          details: 'TestDetails',
          tags: ['x'],
          image: 'img.jpg',
        });
      }
    } as any;

    await component.confirm();
    expect(dismissCalled).toBeTrue();
  });

  it('should call modal.dismiss with null and "cancel" when Cancel button logic is used', async () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const component = fixture.componentInstance;

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

  it('canDismiss() should return true when user selects "Yes"', async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        IonicModule.forRoot(),
        NoopAnimationsModule,
      ],
      providers: [
        provideHttpClient(),
        {
          provide: ActionSheetController,
          useValue: {
            create: async () => ({
              present: () => Promise.resolve(),
              onWillDismiss: () => Promise.resolve({ role: 'confirm' }),
            }),
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(HomeComponent);
    const component = fixture.componentInstance;

    const result = await component.canDismiss();
    expect(result).toBeTrue();
  });

  it('canDismiss() should return true when user selects "No"', async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        IonicModule.forRoot(),
        NoopAnimationsModule,
      ],
      providers: [
        provideHttpClient(),
        {
          provide: ActionSheetController,
          useValue: {
            create: async () => ({
              present: () => Promise.resolve(),
              onWillDismiss: () => Promise.resolve({ role: 'cancel' }),
            }),
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(HomeComponent);
    const component = fixture.componentInstance;

    const result = await component.canDismiss();
    expect(result).toBeFalse();
  });

});
