import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import { ToastController } from '@ionic/angular/standalone';
import {IonicStandaloneStandardImports} from '../../../shared/ionic-imports';
import {Rating} from '../../../model/rating';
import {RatingListItemComponent} from '../rating-list-item/rating-list-item.component';
import { Rit } from '../../../model/rit';
import { RitService } from '../../../shared/services/rit.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-all-rating',
  templateUrl: './all-ratings.component.html',
  styleUrls: ['./all-ratings.component.scss'],
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, ...IonicStandaloneStandardImports, RatingListItemComponent
  ],
})

export class AllRatingsComponent {
  ratings: Rating[] = [];

  constructor(
    private readonly ritService: RitService,
    private readonly toastController: ToastController,
    private readonly activatedRoute: ActivatedRoute,
  ) { }

  ionViewWillEnter(): void {
    this.loadRatings(this.activatedRoute.snapshot.params['ritId']);
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
    this.ratings = data;
  }

  private handleError(err: any) {
    this.ratings = [];
    const baseError = err.error?.error ?? 'Unknown error';
    const fields = err.error?.fields;

    // if (fields) {
    // Handle field-specific errors
    // }
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
