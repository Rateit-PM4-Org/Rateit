import { of } from "rxjs";
import { AuthService } from "../services/auth.service";

export function provideMockAuthService(authStatus: boolean): any {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'getAuthenticationStatusObservable', 'login', 'logout', 'getToken']);
    authServiceSpy.getToken.and.returnValue(authStatus? 'token' : null);
    authServiceSpy.isAuthenticated.and.returnValue(authStatus);
    authServiceSpy.getAuthenticationStatusObservable.and.returnValue(of(authStatus));
    authServiceSpy.login.and.returnValue(of({}));

    return {
        provide: AuthService,
        useValue: authServiceSpy
    };
}