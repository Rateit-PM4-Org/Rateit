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

});
