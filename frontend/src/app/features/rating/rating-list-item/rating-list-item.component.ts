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

  formatRelativeTime(date: any): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();

    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 60) {
      return `${minutes} minutes ago`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} hours ago`;
    }

    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  }

  isBelowRating(index: number): boolean {
    return index < this.rating.value!;
  }
}
