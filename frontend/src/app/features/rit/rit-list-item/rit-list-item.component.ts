import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Rating } from '../../../model/rating';
import { Rit } from '../../../model/rit';
import { IonicStandaloneStandardImports } from '../../../shared/ionic-imports';
import { NavController } from '@ionic/angular';

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

  constructor(private readonly router: Router, private readonly navCtrl: NavController) {
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

  private isInHomeTab(): boolean {
    return this.router.url.includes('/tabs/home');
  }

  navigateToRatings(): void {
    const path = this.isInHomeTab()
      ? `/tabs/home/rits/ratings/${this.rit.id}`
      : `/tabs/rits/ratings/${this.rit.id}`;
    this.navCtrl.navigateForward(path);
  }

  navigateToRit(): void {
    const path = this.isInHomeTab()
      ? `/tabs/home/rits/view/${this.rit.id}`
      : `/tabs/rits/view/${this.rit.id}`;
    this.navCtrl.navigateForward(path);
  }

  navigateToTag(tagName: string, event: Event): void {
    this.router.navigate(['/tabs/rits'], {
      queryParams: { tag: tagName }
    });
    event.stopPropagation();
  }

}
