import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicStandaloneStandardImports} from '../../../shared/ionic-imports';
import {Rating} from '../../../model/rating';

@Component({
  selector: 'app-rating-list-item',
  templateUrl: './rating-list-item.component.html',
  styleUrls: ['./rating-list-item.component.scss'],
  standalone: true,
  imports: [CommonModule, ...IonicStandaloneStandardImports],
})

export class RatingListItemComponent {
  @Input() rating!: Rating;
}
