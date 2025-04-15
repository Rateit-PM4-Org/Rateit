import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseEndpoint = environment.apiUrl;

  constructor(private readonly http: HttpClient, private readonly authService: AuthService) {
  }

  get(path: string): Observable<any> {
    return this.http.get<any>(this.baseEndpoint + path, this.addTokenHeader()).pipe(
      catchError(error => {
        if (error.status === 403) {
          this.authService.logout();
        }
        throw error;
      })
    );
  }

  post(path: string, body: Object): Observable<any> {
    return this.http.post<any>(this.baseEndpoint + path, body, this.addTokenHeader()).pipe(
      catchError(error => {
        if (error.status === 403) {
          this.authService.logout();
        }
        throw error;
      })
    );
  }

  put(path: string, body: Object): Observable<any> {
    return this.http.put<any>(this.baseEndpoint + path, body, this.addTokenHeader()).pipe(
      catchError(error => {
        if (error.status === 403) {
          this.authService.logout();
        }
        throw error;
      })
    );
  }

  addTokenHeader() {
    if (this.authService.getToken() != null) {
      return { headers: { Authorization: `Bearer ${this.authService.getToken()}` } };
    }
    return {};
  }

}
