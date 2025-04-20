import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Rating } from '../../../model/rating';
import { Rit } from '../../../model/rit';
import { IonicStandaloneStandardImports } from '../../../shared/ionic-imports';

@Component({
  selector: 'app-rit-list-item',
  templateUrl: './rit-list-item.component.html',
  styleUrls: ['./rit-list-item.component.scss'],
  standalone: true,
  imports: [CommonModule, ...IonicStandaloneStandardImports],
})

export class RitListItemComponent {
  @Input() rit!: Rit;
  @Input() currentPage!: string;

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
    this.router.navigate(this.currentPage === 'home' ? ['home/rits/ratings', this.rit.id] : ['/rits/ratings', this.rit.id]);
  }

  navigateToRit(): void {
    this.router.navigate(this.currentPage === 'home' ? ['/home/rits/view', this.rit.id] : ['/rits/view', this.rit.id]);
  }

}
