import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private readonly endpoint = environment.apiUrl+'/test';

  constructor(private readonly http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get<any>(this.endpoint);
  }
}
