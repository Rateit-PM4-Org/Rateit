import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { provideRouter, Router, RouterOutlet } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

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
      ],
    }).compileComponents();
  
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  }));

  it('should navigate to /profile', waitForAsync(async () => {
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

  it('should navigate "" to /home', waitForAsync(async () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    await router.navigate(['/']);
    fixture.detectChanges();

    expect(location.path()).toBe('/home');
  }));

});
