import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonItem, IonLabel, IonList, IonSpinner, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from './shared/services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonSpinner
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
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
