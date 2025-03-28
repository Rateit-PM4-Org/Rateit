import { TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { provideHttpClient } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ProfileComponent } from './profile.component';
import { UserService } from '../../../shared/services/user.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideMockAuthService } from '../../../shared/test-util/test-util';

describe('ProfileComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProfileComponent,
        IonicModule.forRoot(),
        NoopAnimationsModule
      ],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(ProfileComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render "Profile" in ion-title', () => {
    const fixture = TestBed.createComponent(ProfileComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('ion-title');
    expect(title?.textContent).toContain('Profile');
  });

  it('should fetch and set profile data on ngOnInit', () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getProfile']);
    const mockProfile = { name: 'John Doe', email: 'john.doe@example.com' };
    userServiceSpy.getProfile.and.returnValue(of(mockProfile));

    TestBed.overrideProvider(UserService, { useValue: userServiceSpy });
    const fixture = TestBed.createComponent(ProfileComponent);
    const component = fixture.componentInstance;

    component.ngOnInit();

    expect(userServiceSpy.getProfile).toHaveBeenCalled();
    expect(component.profile).toEqual(mockProfile);
  });

  it('should call AuthService.logout and navigate to /home on logout', () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);


    TestBed.overrideProvider(AuthService, provideMockAuthService(false));
    TestBed.overrideProvider(Router, { useValue: routerSpy });
    const authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    const fixture = TestBed.createComponent(ProfileComponent);
    const component = fixture.componentInstance;

    component.logout();

    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  });

});
