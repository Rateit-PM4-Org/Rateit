import { Component, OnInit } from '@angular/core';
import { ApiService } from './shared/services/api.service';
import { CommonModule } from '@angular/common';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  data: any[] = [];
  errorMessage: string = '';

  constructor(private apiService: ApiService) {}

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
