import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, IonModal, ToastController } from '@ionic/angular/standalone';
import { Observable } from 'rxjs';
import { Rit } from '../../../model/rit';
import { IonicStandaloneStandardImports } from '../../../shared/ionic-imports';
import { RitService } from '../../../shared/services/rit.service';
import { UserService } from '../../../shared/services/user.service';
import { RitCreateComponent } from '../../rit/rit-create/rit-create.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    CommonModule, ...IonicStandaloneStandardImports, RitCreateComponent
  ],
})
export class HomeComponent implements OnInit {

  @ViewChild(IonModal) modal!: IonModal;
  @ViewChild('ritCreate') ritCreateComponent!: RitCreateComponent;

  presentingElement!: HTMLElement | null;
  data: any[] = [];

  isLoggedIn$!: Observable<boolean>;

  constructor(
    private readonly actionSheetCtrl: ActionSheetController,
    private readonly ritService: RitService,
    private readonly toastController: ToastController,
    private readonly userService: UserService
  ) { }

  ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page');
    this.isLoggedIn$ = this.userService.isLoggedIn();
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
    const request: Rit = {
      name: this.ritCreateComponent.ritName,
      details: this.ritCreateComponent.details,
      tags: this.ritCreateComponent.tags ?? [],
    };

    this.ritService.createRit(request).subscribe({
      next: () => {
        this.showSuccessToast('Rit created successfully!');
        this.modal.dismiss(null, 'confirm');
      },
      error: (err) => {
        const baseError = err.error?.error ?? 'Unknown error';

        const fields = err.error?.fields;
        if (fields) {
          if (fields.name) {
            this.ritCreateComponent.ritNameErrorMessage = `${fields.name}`;
          }
          if (fields.details) {
            this.ritCreateComponent.detailsErrorMessage = `${fields.details}`;
          }
          if (fields.tags) {
            this.ritCreateComponent.tagsErrorMessage = `${fields.tags}`;
          }
        } else {
          this.showErrorToast(baseError);
        }
      },
    });
  }

}
