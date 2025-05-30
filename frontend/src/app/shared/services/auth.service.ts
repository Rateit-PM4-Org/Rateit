import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, map, Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly endpoint = environment.apiUrl + '/api/users';
  private readonly token: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private readonly http: HttpClient) {
    this.token.next(localStorage.getItem('token'));
  }

  getToken(): string | null {
    return this.token.getValue();
  }

  isAuthenticated(): boolean {
    return !!this.token.getValue();
  }

  getAuthenticationStatusObservable(): Observable<boolean> {
    return this.token.pipe(map(token => !!token));
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.endpoint + '/login', {email, password}).pipe(
      map(response => {
        this.setToken(response.token);
        return response;
      })
    );
  }

  logout(): void {
    this.setToken(null);
  }

  private setToken(token: string | null): void {

    if (token != null) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    this.token.next(token);

  }

}
