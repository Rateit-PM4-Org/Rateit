import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, Observable} from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly profile = new BehaviorSubject<any>(null);

  constructor(private readonly apiService: ApiService, authService: AuthService) { 
    authService.getAuthenticationStatusObservable().subscribe(authenticated => {
      if(authenticated){
        this.reloadProfile();
      }else{
        this.profile.next(null);
      }
    });
  }

  getProfile(): Observable<any> {
    return this.profile.asObservable();
  }

  private reloadProfile(): void {
    console.log('getProfile');
    this.apiService.get('/user/me').subscribe(profile => {
      this.profile.next(profile);
    });
  }


  register(email: string, displayName: string, password: string): Observable<any> {
    return this.apiService.post('/user/register', { email, displayName, password });
  }
}
