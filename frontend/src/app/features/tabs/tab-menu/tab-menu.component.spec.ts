import { TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { provideHttpClient } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TabMenuComponent } from './tab-menu.component';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { routes } from '../../../app.routes';
import { AuthService } from '../../../shared/services/auth.service';
import { of } from 'rxjs';

describe('TabMenuComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TabMenuComponent,
        IonicModule.forRoot(),
        NoopAnimationsModule
      ],
      providers: [provideHttpClient(), provideRouter(routes)]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(TabMenuComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render two tab buttons', () => {
    const fixture = TestBed.createComponent(TabMenuComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const tabButtons = compiled.querySelectorAll('ion-tab-button');
    expect(tabButtons.length).toBeGreaterThanOrEqual(2);
  });

  it('should have a "home" tab', () => {
    const fixture = TestBed.createComponent(TabMenuComponent);
    const compiled = fixture.nativeElement as HTMLElement;
    const homeTab = compiled.querySelector('ion-tab-button[tab="home"]');
    expect(homeTab).toBeTruthy();
  });

  it('should have a "login" tab, when not logged in', () => {
    const fixture = TestBed.createComponent(TabMenuComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const loginTab = compiled.querySelector('ion-tab-button[tab="login"]');
    expect(loginTab).toBeTruthy();
  });

  it('should have a "profile" tab, when logged in', () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout', 'getAuthenticationStatusObservable']);

    authServiceSpy.getAuthenticationStatusObservable.and.returnValue(of(true));

    TestBed.overrideProvider(AuthService, { useValue: authServiceSpy });
    const fixture = TestBed.createComponent(TabMenuComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const profileTab = compiled.querySelector('ion-tab-button[tab="profile"]');
    expect(profileTab).toBeTruthy();
  });

});
