import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {IonBackButton, ToastController, ViewWillEnter, ViewWillLeave} from '@ionic/angular/standalone';
import {IonicStandaloneStandardImports} from '../../../shared/ionic-imports';
import {Rating} from '../../../model/rating';
import {RatingListItemComponent} from '../rating-list-item/rating-list-item.component';
import {RitService} from '../../../shared/services/rit.service';
import {ActivatedRoute} from '@angular/router';
import {FabIntegrationComponent} from '../../modal/fab-integration/fab-integration.component';
import {Rit} from '../../../model/rit';
import {Observable, Subscription} from 'rxjs';

@Component({
  selector: 'app-all-rating',
  templateUrl: './all-ratings.component.html',
  styleUrls: ['./all-ratings.component.scss'],
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, ...IonicStandaloneStandardImports, RatingListItemComponent, FabIntegrationComponent, IonBackButton
  ],
})

export class AllRatingsComponent implements ViewWillEnter, ViewWillLeave {
  rit$: Observable<Rit | null>;
  ratings: Rating[] = [];

  private readonly ritSubscription: Subscription | null = null;

  constructor(
    private readonly ritService: RitService,
    private readonly toastController: ToastController,
    private readonly activatedRoute: ActivatedRoute,
  ) {
    this.rit$ = this.ritService.getRitById(this.activatedRoute.snapshot.params['ritId'])
  }

  ionViewWillEnter(): void {
    this.loadRatings(this.activatedRoute.snapshot.params['ritId']);
  }

  ionViewWillLeave(): void {
    if (this.ritSubscription) {
      this.ritSubscription.unsubscribe();
    }
  }

  loadRatings(ritId: string): void {
    this.ritService.getRitById(ritId).subscribe({
      next: (data) => {
        this.handleSuccess(data?.ratings ?? []);
      },
      error: (err) => {
        this.handleError(err);
      }
    });
  }

  async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1000,
      position: 'top',
      color: 'danger',
    });

    await toast.present();
  }

  async showSuccessToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: 'success',
    });

    await toast.present();
  }

  deleteRating(ratingId: string | undefined) {
    this.ritService.deleteRating(this.activatedRoute.snapshot.params['ritId'], ratingId).subscribe({
      next: () => {
        this.showSuccessToast('Rating deleted successfully!');
        this.ritService.triggerRitsReload().subscribe({});
        this.loadRatings(this.activatedRoute.snapshot.params['ritId']);
      },
      error: (err) => {
        this.handleError(err);
      }
    });
  }

  private handleSuccess(data: Rating[]) {
    this.ratings = [...data];
    // sort by updatedAt descending
    if (this.ratings.length > 0) {
      this.ratings.sort((a, b) => {
        const dateA = new Date(a.updatedAt ?? 0);
        const dateB = new Date(b.updatedAt ?? 0);
        return dateB.getTime() - dateA.getTime();
      });
    }
  }

  private handleError(err: any) {
    this.ratings = [];
    const baseError = err.error?.error ?? 'Unknown error';
    this.showErrorToast(baseError);
  }
}
