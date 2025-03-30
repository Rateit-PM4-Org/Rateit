import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicStandaloneStandardImports } from '../../../shared/ionic-imports';
import { addIcons } from 'ionicons';
import { star, starOutline } from 'ionicons/icons';

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

  setRating(value: number) {
    this.rating = this.rating === value ? 0 : value;
  }

}
