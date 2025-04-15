import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController } from '@ionic/angular/standalone';
import { IonModal, ToastController } from '@ionic/angular/standalone';
import { IonicStandaloneStandardImports } from '../../../shared/ionic-imports';
import { CommonModule } from '@angular/common';
import { RitService } from '../../../shared/services/rit.service';
import { RitCreateComponent } from '../../rit/rit-create/rit-create.component';
import { Rit } from '../../../model/rit';

@Component({
  selector: 'app-rit-create-modal',
  templateUrl: './rit-create-modal.component.html',
  styleUrls: ['./rit-create-modal.component.scss'],
  imports: [CommonModule, ...IonicStandaloneStandardImports, RitCreateComponent],
  standalone: true,
})
export class RitCreateModalComponent implements OnInit {
    @ViewChild(IonModal) modal!: IonModal;
    @ViewChild('ritCreate') ritCreateComponent!: RitCreateComponent;
    protected presentingElement!: HTMLElement | null;

  constructor(private readonly toastController: ToastController, 
    private actionSheetCtrl: ActionSheetController) { }

  ngOnInit() {
    this.presentingElement = document.querySelector('ion-page');
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
      if (await this.ritCreateComponent.createRit()) {
        this.modal.dismiss(null, 'confirm');
      }
    }

}
