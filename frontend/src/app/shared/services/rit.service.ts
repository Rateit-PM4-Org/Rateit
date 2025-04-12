import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Rit } from '../../model/rit';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RitService {
  private readonly rits = new BehaviorSubject<Rit[]>([]);

  constructor(private readonly apiService: ApiService, authService: AuthService) {
    authService.getAuthenticationStatusObservable().subscribe(authenticated => {
      if (authenticated) {
        this.triggerRitsReload();
      } else {
        this.rits.next([]);
      }
    });
  }

  createRit(rit: Rit): Observable<any> {
    return this.apiService.post('/rit/create', rit).pipe(
      tap(() => {
        this.triggerRitsReload();
      })
    )
  }

  getRits(): Observable<Rit[]> {
    return this.rits.asObservable();
  }

  triggerRitsReload(): void {
    let observable = this.apiService.get('/rit/rits');
    observable.subscribe({
      next: (data) => {
        this.rits.next(data);
      },
      error: () => {
        this.rits.error({
          error: {
            error: 'Error loading rits',
            code: 'RITS_FETCH_FAIL'
          }
        });
      }
    });
  }
}
