import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { addIcons } from 'ionicons';
import { star, starOutline } from 'ionicons/icons';
import { IonicStandaloneStandardImports } from '../../../shared/ionic-imports';

addIcons({ star, 'star-outline': starOutline });

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.scss'],
  imports: [CommonModule, ...IonicStandaloneStandardImports],
  standalone: true,
})
export class RateComponent {

  constructor() { }

  rating: number = 0;
  positiveComment: string = '';
  negativeComment: string = '';

  setRating(value: number) {
    this.rating = this.rating === value ? 0 : value;
  }

  setPositiveComment(e: any) {
    this.positiveComment = e.target.value;
  }
  setNegativeComment(e: any) {
    this.negativeComment = e.target.value;
  }

}
