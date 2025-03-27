import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(waitForAsync(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);

    TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideHttpClient(),
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
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set email when setEmail is called', () => {
    const mockEvent = { target: { value: 'test@example.com' } } as any;
    component.setEmail(mockEvent);
    expect(component.email).toBe('test@example.com');
  });

  it('should set password when setPassword is called', () => {
    const mockEvent = { target: { value: 'password123' } } as any;
    component.setPassword(mockEvent);
    expect(component.password).toBe('password123');
  });

  it('should call AuthService.login and navigate on successful login', () => {
    authServiceSpy.login.and.returnValue(of({}));
    component.email = 'test@example.com';
    component.password = 'password123';

    component.login();

    expect(authServiceSpy.login).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/');
    expect(component.email).toBe('');
    expect(component.password).toBe('');
  });

  it('should navigate to register page when register is called', () => {
    component.register();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/register']);
  });
});
