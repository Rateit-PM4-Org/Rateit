import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { catchError, of } from 'rxjs';
import { IonicStandaloneComponents } from '../../../shared/ionic-imports';
import { ApiService } from '../../../shared/services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, ...IonicStandaloneComponents
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  data: any[] = [];
  errorMessage: string = '';

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getData().pipe(
      catchError(error => {

        console.error('Error fetching data:', error);
        this.errorMessage = 'Failed to fetch data from backend';
        return of([]); // Return an empty array in case of error
      })
    ).subscribe({
      next: response => {
        console.log('API Response:', response);
        this.data = response; // Assign the response directly
      },
      error: err => {
        console.error('Subscription Error:', err);
        this.errorMessage = 'An error occurred';
      }
    });
  }

}
