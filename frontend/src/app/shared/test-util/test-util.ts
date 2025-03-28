import { of } from "rxjs";
import { AuthService } from "../services/auth.service";
import { ApiService } from "../services/api.service";

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

export function provideMockApiService(): any {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['get', 'post']);
    apiServiceSpy.get.and.returnValue(of({}));
    apiServiceSpy.post.and.returnValue(of({}));

    return {
        provide: ApiService,
        useValue: apiServiceSpy
    };
}