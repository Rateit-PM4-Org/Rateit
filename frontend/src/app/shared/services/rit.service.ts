import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rit } from '../../model/rit';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class RitService {

  constructor(private readonly apiService: ApiService) { }

  createRit(rit: Rit): Observable<any> {
    return this.apiService.post('/rit/create', rit);
  }

  updateRit(rit: Rit, ritId: string): Observable<Rit> {
    return this.apiService.put('/rit/update/' + ritId, rit);
  }

  getAllRits(): Observable<Rit[]> {
    return this.apiService.get('/rit/rits');
  }

  getRit(ritId: string): Observable<Rit> {
    return this.apiService.get('/rit/read/' + ritId);
  }
}
