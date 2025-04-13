import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { Rit } from '../../model/rit';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RitService {
  private readonly rits = new BehaviorSubject<Rit[]>([]);
  private readonly ritsErrorStream = new Subject<any>();

  constructor(private readonly apiService: ApiService, authService: AuthService) {
    authService.getAuthenticationStatusObservable().subscribe(authenticated => {
      if (authenticated) {
        this.triggerRitsReload().subscribe({});
      } else {
        this.rits.next([]);
      }
    });
  }

  createRit(rit: Rit): Observable<any> {
    return this.apiService.post('/rit/create', rit).pipe(
      tap(() => {
        this.triggerRitsReload().subscribe({});
      })
    )
  }

  getRits(): Observable<Rit[]> {
    return this.rits.asObservable();
  }

  getRitsErrorStream(): Observable<any> {
    return this.ritsErrorStream.asObservable();
  }

  triggerRitsReload(): Observable<Rit[]> {
    return this.apiService.get('/rit/rits').pipe(
      tap({
        next: (data) => {
          this.rits.next(data);
        },
        error: (err) => {
          this.ritsErrorStream.next({
            error: {
              error: 'Error loading Rits',
              code: 'RITS_FETCH_FAIL'
            }
          });
        }
      })
    );
  }
}
