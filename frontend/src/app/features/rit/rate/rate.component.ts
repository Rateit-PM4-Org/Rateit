import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { addIcons } from 'ionicons';
import { star, starOutline } from 'ionicons/icons';
import { IonicStandaloneStandardImports } from '../../../shared/ionic-imports';
import { Observable } from 'rxjs';
import { Rit } from '../../../model/rit';
import { Rating } from '../../../model/rating';
import { RitService } from '../../../shared/services/rit.service';
import { ModalContent } from '../../modal/modal-view/modal-view.component';
import { ToastController, IonBackButton } from '@ionic/angular/standalone';

addIcons({ star, 'star-outline': starOutline });

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.scss'],
  imports: [IonBackButton, CommonModule, ...IonicStandaloneStandardImports],
  standalone: true,
})
export class RateComponent implements ModalContent{
  @Input() rit!: Observable<Rit|null> | null;
  @Output() isDisabled = new EventEmitter<boolean>();
  private ritSubscription: any;
  protected currentRit: Rit|null = null;

  constructor(private readonly ritService: RitService, private readonly toastController: ToastController) { }

  ngOnInit() {
    this.ritSubscription = this.rit?.subscribe((data) => {
      this.currentRit = data;
    })
  }
  ngOnDestroy() {
    if (this.ritSubscription) {
      this.ritSubscription.unsubscribe();
    }
  }

  rating: number = 0;
  positiveComment: string = '';
  negativeComment: string = '';

  setRating(value: number) {
    this.rating = this.rating === value ? 0 : value;
    this.validateFields();
  }

  setPositiveComment(e: any) {
    this.positiveComment = e.target.value;
  }
  setNegativeComment(e: any) {
    this.negativeComment = e.target.value;
  }

  submit(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.ritService.createRating(this.buildRequest()).subscribe({
        next: (rit) => {
          this.handleSuccess(rit, 'Rating created successfully!');
          resolve(true);
        },
        error: (err) => {
          this.handleError(err);
          resolve(false);
        },
      });
    });
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

  async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      position: 'top',
      color: 'danger',
    });

    await toast.present();
  }

  
  private buildRequest(): Rating {
    return {
      rit: {id: this.currentRit?.id},
      value: this.rating,
      positiveComment: this.positiveComment,
      negativeComment: this.negativeComment,
    };
  }

  private handleSuccess(rit: Rit, toastMessage: string) {
    this.rating = 0;
    this.positiveComment = '';
    this.negativeComment = '';

    this.showSuccessToast(toastMessage);
    this.ritService.triggerRitsReload().subscribe({});
  }

  private handleError(err: any) {
    const baseError = err.error?.error ?? 'Unknown error';
    const fields = err.error?.fields;

    if (fields) {
      this.setFieldErrorMessages(fields);
    } else {
      this.showErrorToast(baseError);
    }
  }

  private setFieldErrorMessages(fields: any) {
    // TODO: Handle field errors show in the UI
  }

  private formatFieldError(fieldError: string | string[]): string {
    return Array.isArray(fieldError) ? fieldError.join(', ') : `${fieldError}`;
  }

  validateFields() {
    console.log(this.rating)
    this.isDisabled.emit(this.rating === 0);
  }


}
