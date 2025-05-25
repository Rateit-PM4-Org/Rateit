import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {LoginComponent} from './login.component';
import {provideHttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../shared/services/auth.service';
import {throwError} from 'rxjs';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideMockAuthService} from '../../../shared/test-util/test-util';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(waitForAsync(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);

    TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideMockAuthService(false),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: {
                returnUrl: '/'
              }
            }
          }
        },
        {provide: Router, useValue: routerSpy},]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call AuthService.login and navigate on successful login to home', () => {
    const authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    component.form.setValue({
      email: 'test@example.com',
      password: 'password123'
    });

    component.login();

    expect(authServiceSpy.login).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should call AuthService.login and navigate on successful login to get-param', () => {
    const authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    const route = TestBed.inject(ActivatedRoute);
    route.snapshot.queryParams['returnUrl'] = '/profile';

    component.form.setValue({
      email: 'test@example.com',
      password: 'password123'
    });

    component.login();

    expect(authServiceSpy.login).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/profile');
  });

  it('should navigate to register page when register is called', () => {
    component.register();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tabs/register']);
  });

  it('should set errorMessage and clear password on login error', () => {
    const authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    component.form.setValue({
      email: 'test@example.com',
      password: 'password123'
    });

    const mockError = {
      error: {
        message: 'Invalid credentials'
      }
    };
    authServiceSpy.login.and.returnValue(throwError(() => mockError));

    component.login();

    expect(component.form.get('password')?.value).toBe('');
    expect(component.loginErrorFields).toEqual({});
  });

});
