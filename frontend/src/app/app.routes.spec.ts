import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { provideRouter, Router, RouterOutlet } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { AuthGuard } from './shared/guards/auth.guard';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './shared/services/auth.service';
import { of } from 'rxjs';
import { provideMockAuthService } from './shared/test-util/test-util';

@Component({
  standalone: true,
  selector: 'test-host',
  template: '<router-outlet></router-outlet>',
  imports: [RouterOutlet],
})
class TestHostComponent { }

describe('App Routing', () => {
  let router: Router;
  let location: Location;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideMockAuthService(true)
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  }));

  it('should not navigate to /profile (empty instead) if not authenticated', waitForAsync(async () => {
    const authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    authServiceSpy.isAuthenticated.and.returnValue(false);
    
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    await router.navigate(['/tabs/profile']);
    fixture.detectChanges();

    expect(location.path()).toBe('');
  }));

  it('should navigate to /tabs/profile if authenticated', waitForAsync(async () => {
    const authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    authServiceSpy.isAuthenticated.and.returnValue(true);
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    await router.navigate(['/tabs/profile']);
    fixture.detectChanges();

    expect(location.path()).toBe('/tabs/profile');
  }));

  it('should navigate to /tabs/home', waitForAsync(async () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    await router.navigate(['/tabs/home']);
    fixture.detectChanges();

    expect(location.path()).toBe('/tabs/home');
  }));

  it('should navigate to /tabs/user/mail-confirmation', waitForAsync(async () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    await router.navigate(['/tabs/user/mail-confirmation']);
    fixture.detectChanges();

    expect(location.path()).toBe('/tabs/user/mail-confirmation');
  }
  ));

  it('should navigate to /tabs/login', waitForAsync(async () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    await router.navigate(['/tabs/login']);
    fixture.detectChanges();

    expect(location.path()).toBe('/tabs/login');
  }));

  it('should navigate to /tabs/register', waitForAsync(async () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    await router.navigate(['/tabs/register']);
    fixture.detectChanges();

    expect(location.path()).toBe('/tabs/register');
  }));

  it('should navigate "" to /tabs/home', waitForAsync(async () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    await router.navigate(['/']);
    fixture.detectChanges();

    expect(location.path()).toBe('/tabs/home');
  }));

  it('should navigate to /tabs/rits', waitForAsync(async () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    await router.navigate(['/tabs/rits']);
    fixture.detectChanges();

    expect(location.path()).toBe('/tabs/rits');
  }));

  it('should navigate to /tabs/rits/view/12', waitForAsync(async () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    await router.navigate(['/tabs/rits/view/12']);
    fixture.detectChanges();

    expect(location.path()).toBe('/tabs/rits/view/12');
  }));

  it('should navigate to /tabs/rits/ratings/12', waitForAsync(async () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    await router.navigate(['/tabs/rits/ratings/12']);
    fixture.detectChanges();

    expect(location.path()).toBe('/tabs/rits/ratings/12');
  }));

  it('should navigate to /tabs/build-info', waitForAsync(async () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    await router.navigate(['/build-info']);
    fixture.detectChanges();

    expect(location.path()).toBe('/tabs/build-info');
  }));
});
