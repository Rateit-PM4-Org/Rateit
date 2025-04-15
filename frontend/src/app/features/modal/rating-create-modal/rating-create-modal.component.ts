import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, IonModal, ToastController } from '@ionic/angular/standalone';
import { RateComponent } from '../../rit/rate/rate.component';
import { RitService } from '../../../shared/services/rit.service';
import { Rating } from '../../../model/rating';
import { Rit } from '../../../model/rit';
import { CommonModule } from '@angular/common';
import { IonicStandaloneStandardImports } from '../../../shared/ionic-imports';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-rating-create-modal',
  templateUrl: './rating-create-modal.component.html',
  styleUrls: ['./rating-create-modal.component.scss'],
  imports: [RateComponent, CommonModule, ...IonicStandaloneStandardImports],
  standalone: true,
})
export class RatingCreateModalComponent  implements OnInit {
  @Input() rit!: Observable<Rit|null> | null;
  private ritSubscription: any;
  protected currentRit: Rit|null = null;
  protected presentingElement!: HTMLElement | null;
  @ViewChild(IonModal) modal!: IonModal;
  @ViewChild(RateComponent) rateComponent!: RateComponent

constructor(private readonly toastController: ToastController, 
  private actionSheetCtrl: ActionSheetController,
private readonly ritService: RitService) { }

ngOnInit() {
  this.ritSubscription = this.rit?.subscribe((data) => {
    this.currentRit = data;
  })
  this.presentingElement = document.querySelector('ion-page');
}

ngOnDestroy() {
  if (this.ritSubscription) {
    this.ritSubscription.unsubscribe();
  }
}

async showSuccessToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1000,
      position: 'top',
      color: 'success',
    });

    await toast.present();
  }

  async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: 'danger',
    });

    await toast.present();
  }

  canDismiss = async (data: any, role: string) => {
    if (role === 'cancel') {
      const actionSheet = await this.actionSheetCtrl.create({
        header: 'Are you sure you want to cancel?',
        buttons: [
          {
            text: 'Yes',
            role: 'confirm',
          },
          {
            text: 'No',
            role: 'cancel',
          },
        ],
      });

      await actionSheet.present();
      const { role: actionRole } = await actionSheet.onWillDismiss();

      return actionRole === 'confirm';
    }

    return true;
  };

  async confirm() {
    const request = this.buildRequest();

    console.log(request);

    this.ritService.createRating(request).subscribe({
      next: () => this.handleRitCreateSuccess(),
      error: (err) => this.handleRitCreateError(err),
    });
  }

  private buildRequest(): Rating {
    return {
      rit: {id: this.currentRit?.id},
      value: this.rateComponent.rating,
      positiveComment: this.rateComponent.positiveComment,
      negativeComment: this.rateComponent.negativeComment,
    };
  }

  private handleRitCreateSuccess() {
    this.showSuccessToast('Rating created successfully!');
    this.ritService.triggerRitsReload().subscribe();
    this.modal.dismiss(null, 'confirm');
  }

  private handleRitCreateError(err: any) {
    const baseError = err.error?.error ?? 'Unknown error';
    const fields = err.error?.fields;

    if (fields) {
      this.setFieldErrorMessages(fields);
    } else {
      this.showErrorToast(baseError);
    }
  }

  private setFieldErrorMessages(fields: any) {
    /*if (fields.name) {
      this.ritCreateComponent.ritNameErrorMessage = this.formatFieldError(fields.name);
    }*/
  }

  private formatFieldError(fieldError: string | string[]): string {
    return Array.isArray(fieldError) ? fieldError.join(', ') : `${fieldError}`;
  }

}
