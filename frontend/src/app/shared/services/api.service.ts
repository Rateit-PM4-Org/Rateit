import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseEndpoint = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  get(path: String): Observable<any> {
    return this.http.get<any>(this.baseEndpoint + path, this.addTokenHeader()).pipe(
      catchError(error => {
        if (error.status === 403) {
          this.authService.logout();
        }
        throw error;
      })
    );
  }

  post(path: String, body: Object): Observable<any> {
    return this.http.post<any>(this.baseEndpoint + path, body, this.addTokenHeader()).pipe(
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
