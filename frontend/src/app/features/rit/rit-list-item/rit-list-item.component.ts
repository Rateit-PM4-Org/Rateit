import {CommonModule} from '@angular/common';
import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {Rit} from '../../../model/rit';
import {IonicStandaloneStandardImports} from '../../../shared/ionic-imports';
import {Rating} from '../../../model/rating';

@Component({
  selector: 'app-rit-list-item',
  templateUrl: './rit-list-item.component.html',
  styleUrls: ['./rit-list-item.component.scss'],
  standalone: true,
  imports: [CommonModule, ...IonicStandaloneStandardImports],
})

export class RitListItemComponent {
  @Input() rit!: Rit;

  protected latestRatingValue: number = 0;

  constructor(private readonly router: Router) {
  }

  ngOnInit() {
    this.latestRatingValue = this.calculateLatestRatingValue(this.rit.ratings ?? []);
  }

  calculateLatestRatingValue(ratings: Rating[]): number {
    if (ratings.length === 0) {
      return 0;
    }
    const latestRating = ratings.reduce((prev, current) => {
      return new Date(prev.createdAt!) > new Date(current.createdAt!) ? prev : current;
    }, ratings[0]);

    return latestRating.value ?? 0;
  }

  navigateToRatings(): void {
    this.router.navigate(['/ratings', this.rit.id]);
  }

  goToRit() {
    this.router.navigate(['/rits/view/' + this.rit.id]);
  }

}
