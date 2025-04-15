import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import { IonBackButton,ToastController } from '@ionic/angular/standalone';
import {IonicStandaloneStandardImports} from '../../../shared/ionic-imports';
import {Rating} from '../../../model/rating';
import {RatingListItemComponent} from '../rating-list-item/rating-list-item.component';
import { RitService } from '../../../shared/services/rit.service';
import { ActivatedRoute } from '@angular/router';
import { FabIntegrationComponent } from '../../modal/fab-integration/fab-integration.component';
import { Rit } from '../../../model/rit';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-all-rating',
  templateUrl: './all-ratings.component.html',
  styleUrls: ['./all-ratings.component.scss'],
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, ...IonicStandaloneStandardImports, RatingListItemComponent, FabIntegrationComponent, IonBackButton
  ],
})

export class AllRatingsComponent {
  rit: Observable<Rit | null>;
  ratings: Rating[] = [];

  private readonly ritSubscription: Subscription | null = null;

  constructor(
    private readonly ritService: RitService,
    private readonly toastController: ToastController,
    private readonly activatedRoute: ActivatedRoute,
  ) { 
    this.rit = this.ritService.getRitById(this.activatedRoute.snapshot.params['ritId'])
  }

  ionViewWillEnter(): void {
    this.loadRatings(this.activatedRoute.snapshot.params['ritId']);
  }

  ionViewDidLeave(): void {
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

  private handleSuccess(data: Rating[]) {
    if (data.length === 0) {
      return;
    }
    this.ratings = [...data];
    // sort by updatedAt descending
    this.ratings.sort((a, b) => {
      const dateA = new Date(a.updatedAt ?? 0);
      const dateB = new Date(b.updatedAt ?? 0);
      return dateB.getTime() - dateA.getTime();
    });

  }

  private handleError(err: any) {
    this.ratings = [];
    const baseError = err.error?.error ?? 'Unknown error';
    this.showErrorToast(baseError);
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
}
