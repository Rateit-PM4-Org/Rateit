import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { provideHttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { of, throwError } from 'rxjs';

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
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set email when setEmail is called', () => {
    const mockEvent = { target: { value: 'test@example.com' } } as any;
    component.setEmail(mockEvent);
    expect(component['email']).toBe('test@example.com');
  });

  it('should set displayName when setDisplayName is called', () => {
    const mockEvent = { target: { value: 'John Doe' } } as any;
    component.setDisplayName(mockEvent);
    expect(component['displayName']).toBe('John Doe');
  });

  it('should set password when setPassword is called', () => {
    const mockEvent = { target: { value: 'password123' } } as any;
    component.setPassword(mockEvent);
    expect(component['password']).toBe('password123');
  });

  it('should call UserService.register and navigate to login on successful registration', () => {
    userServiceSpy.register.and.returnValue(of({}));
    component['email'] = 'test@example.com';
    component['displayName'] = 'John Doe';
    component['password'] = 'password123';

    component.register();

    expect(userServiceSpy.register).toHaveBeenCalledWith('test@example.com', 'John Doe', 'password123');
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/login');
  });

});
