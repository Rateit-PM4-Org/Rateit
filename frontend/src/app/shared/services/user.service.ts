import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly profile = new BehaviorSubject<any>(null);

  constructor(private readonly apiService: ApiService, authService: AuthService) {
    authService.getAuthenticationStatusObservable().subscribe(authenticated => {
      if (authenticated) {
        this.reloadProfile();
      } else {
        this.profile.next(null);
      }
    });
  }

  getProfile(): Observable<any> {
    return this.profile.asObservable();
  }

  isLoggedIn(): Observable<boolean> {
    return this.profile.pipe(
      map(profile => profile !== null)
    );
  }

  private reloadProfile(): void {
    this.apiService.get('/user/me').subscribe(profile => {
      this.profile.next(profile);
    });
  }


  register(email: string, displayName: string, password: string): Observable<any> {
    return this.apiService.post('/user/register', { email, displayName, password });
  }

  confirmEmail(email: string, token: string): Observable<any> {
    return this.apiService.get('/user/mail-confirmation?email=' + email + '&token=' + token);
  }
}
