import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {RegisterComponent} from './register.component';
import {provideHttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {UserService} from '../../../shared/services/user.service';
import {of, throwError} from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(waitForAsync(() => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['register']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideHttpClient(),
        {provide: UserService, useValue: userServiceSpy},
        {provide: Router, useValue: routerSpy},
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call UserService.register', () => {
    userServiceSpy.register.and.returnValue(of({}));
    component['form'].setValue({
      email: "test@example.com",
      displayName: "John Doe",
      password: "password123"
    });

    component.register();

    expect(userServiceSpy.register).toHaveBeenCalledWith('test@example.com', 'John Doe', 'password123');
  });

  it('should set registrationSuccess on successful registration', () => {
    userServiceSpy.register.and.returnValue(of({}));

    component.register();

    expect(component['registrationSuccess']).toBe(true);
  });

  it('should set registrationSuccess on registration error', () => {
    const mockError = {
      error: {
        message: 'Registration failed.'
      }
    };

    userServiceSpy.register.and.returnValue(throwError(() => mockError));

    component.register();

    expect(component['registrationSuccess']).toBe(false);
  });
});
