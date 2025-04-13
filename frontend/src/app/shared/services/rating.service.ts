import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {Observable} from 'rxjs';
import {Rating} from '../../model/rating';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  constructor(private readonly apiService: ApiService) { }

  getAllRatings(): Observable<Rating[]> {
    return this.apiService.get('/rit/ratings');
  }
}
