import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ActionSheetController, IonModal, ToastController, ViewWillEnter } from '@ionic/angular/standalone';
import { Observable } from 'rxjs';
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
    RitListItemComponent
  ],
})
export class HomeComponent implements ViewWillEnter {

  @ViewChild(IonModal) modal!: IonModal;
  @ViewChild('ritCreate') ritCreateComponent!: RitCreateComponent;

  presentingElement!: HTMLElement | null;

  rits: Rit[] = [];
  numberOfLatestRitsToShow: number = 10;

  isLoggedIn$!: Observable<boolean>;

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
    this.loadRits();
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
      next: () => this.handleSuccess(),
      error: (err) => this.handleError(err),
    });
  }

  private buildRequest(): Rit {
    return {
      name: this.ritCreateComponent.ritName,
      details: this.ritCreateComponent.details,
      tags: this.ritCreateComponent.tags ?? [],
    };
  }

  private handleSuccess() {
    this.showSuccessToast('Rit created successfully!');
    this.modal.dismiss(null, 'confirm');
    this.loadRits();
  }

  private handleError(err: any) {
    const baseError = err.error?.error ?? 'Unknown error';
    const fields = err.error?.fields;

    if (fields) {
      this.ritCreateComponent.setFieldErrorMessages(fields);
    } else {
      this.showErrorToast(baseError);
    }
  }

  private loadRits(): void {
    this.ritService.getAllRits().subscribe({
      next: (data) => {
        this.handleLoadLatestRitsSuccess(data);
      },
      error: (err) => {
        this.handleLoadLatestRitsError(err);
      }
    });
  }

  private handleLoadLatestRitsSuccess(data: Rit[]) {
    if (data.length === 0) {
      return;
    }
    // sotr by lastInteractionAt descending
    data.sort((a, b) => {
      const dateA = new Date(a.lastInteractionAt ?? 0);
      const dateB = new Date(b.lastInteractionAt ?? 0);
      return dateB.getTime() - dateA.getTime();
    });
    this.rits = data;
  }

  private handleLoadLatestRitsError(err: any) {
    this.rits = [];
    const baseError = err.error?.error ?? 'Unknown error';
    this.showErrorToast(baseError);
  }

  latestRits(): Rit[] {
    return this.rits.slice(0, this.numberOfLatestRitsToShow);
  }

  goToRitsTab() {
    this.router.navigate(['/rits']);
  }
}
