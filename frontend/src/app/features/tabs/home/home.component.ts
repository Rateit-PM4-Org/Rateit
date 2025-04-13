import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ActionSheetController, IonModal, IonRefresher, IonRefresherContent, ToastController, ViewWillEnter } from '@ionic/angular/standalone';
import { Observable, Subscription } from 'rxjs';
import { Rit } from '../../../model/rit';
import { IonicStandaloneStandardImports } from '../../../shared/ionic-imports';
import { RitService } from '../../../shared/services/rit.service';
import { UserService } from '../../../shared/services/user.service';
import { RitCreateComponent } from '../../rit/rit-create/rit-create.component';
import { RitListItemComponent } from '../../rit/rit-list-item/rit-list-item.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ...IonicStandaloneStandardImports,
    RitCreateComponent,
    RitListItemComponent,
    IonRefresher,
    IonRefresherContent,
  ],
})
export class HomeComponent implements ViewWillEnter {

  @ViewChild(IonModal) modal!: IonModal;
  @ViewChild('ritCreate') ritCreateComponent!: RitCreateComponent;

  presentingElement!: HTMLElement | null;

  rits: Rit[] = [];
  numberOfLatestRitsToShow: number = 10;

  isLoggedIn$!: Observable<boolean>;

  ritSubscription: Subscription | null = null;
  ritsErrorSubscription: Subscription | null = null;

  constructor(
    private readonly actionSheetCtrl: ActionSheetController,
    private readonly ritService: RitService,
    private readonly toastController: ToastController,
    private readonly userService: UserService,
    private readonly router: Router,
  ) { }

  ionViewWillEnter() {
    this.presentingElement = document.querySelector('.ion-page');
    this.isLoggedIn$ = this.userService.isLoggedIn();
    this.ritSubscription = this.ritService.getRits().subscribe({
      next: (data) => {
        this.handleLoadRitsSuccess(data);
      },
      error: (err) => {
        this.handleLoadRitsError(err);
      }
    });

    this.ritsErrorSubscription = this.ritService.getRitsErrorStream().subscribe({
      next: (err) => {
        this.handleLoadRitsError(err);
      }
    });
  }

  ionViewWillLeave() {
    this.ritSubscription?.unsubscribe();
    this.ritsErrorSubscription?.unsubscribe();
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

    this.ritService.createRit(request).subscribe({
      next: () => this.handleRitCreateSuccess(),
      error: (err) => this.handleRitCreateError(err),
    });
  }

  private buildRequest(): Rit {
    return {
      name: this.ritCreateComponent.ritName,
      details: this.ritCreateComponent.details,
      tags: this.ritCreateComponent.tags ?? [],
    };
  }

  private handleRitCreateSuccess() {
    this.showSuccessToast('Rit created successfully!');
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
    if (fields.name) {
      this.ritCreateComponent.ritNameErrorMessage = this.formatFieldError(fields.name);
    }
    if (fields.details) {
      this.ritCreateComponent.detailsErrorMessage = this.formatFieldError(fields.details);
    }
    if (fields.tags) {
      this.ritCreateComponent.tagsErrorMessage = this.formatFieldError(fields.tags);
    }
  }

  private formatFieldError(fieldError: string | string[]): string {
    return Array.isArray(fieldError) ? fieldError.join(', ') : `${fieldError}`;
  }

  private handleLoadRitsSuccess(data: Rit[]) {
    // sotr by lastInteractionAt descending
    data.sort((a, b) => {
      const dateA = new Date(a.lastInteractionAt ?? 0);
      const dateB = new Date(b.lastInteractionAt ?? 0);
      return dateB.getTime() - dateA.getTime();
    });
    this.rits = data;
  }

  private handleLoadRitsError(err: any) {
    const baseError = err.error?.error ?? 'Unknown error';
    this.showErrorToast(baseError);
  }

  latestRits(): Rit[] {
    return this.rits.slice(0, this.numberOfLatestRitsToShow);
  }

  goToRitsTab() {
    this.router.navigate(['/rits']);
  }
  handleRefresh(event: CustomEvent) {
    this.ritService.triggerRitsReload().subscribe({
      next: () => {
        (event.target as HTMLIonRefresherElement).complete();
        this.showSuccessToast('Rits loaded successfully!');
      },
      error: () => {
        (event.target as HTMLIonRefresherElement).complete();
      }
    });
  }
}
