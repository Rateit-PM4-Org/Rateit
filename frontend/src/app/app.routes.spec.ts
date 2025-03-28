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
        provideMockAuthService(false)
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  }));

  it('should not navigate to /profile (empty instead) if not authenticated', waitForAsync(async () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    await router.navigate(['/profile']);
    fixture.detectChanges();

    expect(location.path()).toBe('');
  }));

  it('should navigate to /profile if authenticated', waitForAsync(async () => {
    const authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    authServiceSpy.isAuthenticated.and.returnValue(true);
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    await router.navigate(['/profile']);
    fixture.detectChanges();

    expect(location.path()).toBe('/profile');
  }));

  it('should navigate to /home', waitForAsync(async () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    await router.navigate(['/home']);
    fixture.detectChanges();

    expect(location.path()).toBe('/home');
  }));

  it('should navigate to /login', waitForAsync(async () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    await router.navigate(['/login']);
    fixture.detectChanges();

    expect(location.path()).toBe('/login');
  }));

  it('should navigate to /register', waitForAsync(async () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    await router.navigate(['/register']);
    fixture.detectChanges();

    expect(location.path()).toBe('/register');
  }));

  it('should navigate "" to /home', waitForAsync(async () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    await router.navigate(['/']);
    fixture.detectChanges();

    expect(location.path()).toBe('/home');
  }));

});
