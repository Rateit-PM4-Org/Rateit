import {Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable, Subject, tap} from 'rxjs';
import {Rit} from '../../model/rit';
import {ApiService} from './api.service';
import {AuthService} from './auth.service';
import {Rating} from '../../model/rating';

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
    return this.apiService.post('/api/rits', rit);
  }

  getRits(): Observable<Rit[]> {
    return this.rits.asObservable();
  }

  getRit(ritId: string): Observable<Rit> {
    return this.apiService.get('/api/rits/' + ritId);
  }

  getRitById(id: string): Observable<Rit | null> {
    return this.getRits().pipe(
      map(rits => rits.find(rit => rit.id === id)),
      map(rit => rit ?? null)
    );
  }

  updateRit(rit: Rit, ritId: string): Observable<Rit> {
    return this.apiService.put('/api/rits/' + ritId, rit);
  }

  deleteRit(ritId: string | undefined): Observable<any> {
    return this.apiService.delete('/api/rits/' + ritId);
  }

  createRating(ritId: string | undefined, rating: Rating): Observable<any> {
    return this.apiService.post('/api/rits/' + ritId + "/ratings", rating);
  }

  deleteRating(ritId: string | undefined, ratingId: string | undefined): Observable<any> {
    return this.apiService.delete('/api/rits/' + ritId + '/ratings/' + ratingId);
  }

  getRitsErrorStream(): Observable<any> {
    return this.ritsErrorStream.asObservable();
  }

  triggerRitsReload(): Observable<Rit[]> {
    return this.apiService.get('/api/rits').pipe(
      tap({
        next: (data) => {
          this.rits.next(data);
        },
        error: () => {
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

  getAllTags(): Observable<string[]> {
    return this.getRits().pipe(
      map(rits => {
        const allTags = rits
          .filter(rit => rit.tags && rit.tags.length > 0)
          .flatMap(rit => rit.tags);
        return [...new Set(allTags)];
      })
    );
  }
}
