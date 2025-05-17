import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { AuthService } from './auth.service';

export enum AuthState {
  LOADING = 'LOADING',
  AUTHENTICATED = 'AUTHENTICATED',
  NOT_AUTHENTICATED = 'NOT_AUTHENTICATED'
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly profile = new BehaviorSubject<any | null>(null);
  private readonly authState = new BehaviorSubject<AuthState>(AuthState.LOADING);

  constructor(private readonly apiService: ApiService, authService: AuthService) {
    authService.getAuthenticationStatusObservable().subscribe(authenticated => {
      if (authenticated) {
        this.reloadProfile();
      } else {
        this.profile.next(null);
        this.authState.next(AuthState.NOT_AUTHENTICATED);
      }
    });
  }

  getProfile(): Observable<any | null> {
    return this.profile.asObservable();
  }

  getAuthState(): Observable<AuthState> {
    return this.authState.asObservable();
  }

  isLoggedIn(): Observable<boolean> {
    return this.authState.pipe(
      map(state => state === AuthState.AUTHENTICATED)
    );
  }

  private reloadProfile(): void {
    this.authState.next(AuthState.LOADING);

    this.apiService.get('/api/users/me').subscribe({
      next: (profile) => {
        this.profile.next(profile);
        this.authState.next(AuthState.AUTHENTICATED);
      },
      error: () => {
        this.profile.next(null);
        this.authState.next(AuthState.NOT_AUTHENTICATED);
      }
    });
  }

  register(email: string, displayName: string, password: string): Observable<any> {
    return this.apiService.post('/api/users/register', { email, displayName, password });
  }

  confirmEmail(email: string, token: string): Observable<any> {
    return this.apiService.get('/api/users/mail-confirmation?email=' + email + '&token=' + token);
  }
}
