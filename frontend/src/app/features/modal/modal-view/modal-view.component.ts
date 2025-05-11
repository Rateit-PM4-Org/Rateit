import { Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, IonModal, ToastController } from '@ionic/angular/standalone';
import { IonicStandaloneStandardImports } from '../../../shared/ionic-imports';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-view',
  templateUrl: './modal-view.component.html',
  styleUrls: ['./modal-view.component.scss'],
  imports: [CommonModule, ...IonicStandaloneStandardImports],
  standalone: true,
})
export class ModalViewComponent implements OnInit {
    @ViewChild(IonModal) modal!: IonModal;
    @Input() content!: ModalContent;
    @Input() title!: string;
    @Input() confirmable!: boolean;
    
    protected isDisabled: boolean = true;
    protected presentingElement!: HTMLElement | null;
    private subscription: any;

  constructor(private readonly toastController: ToastController, 
    private readonly actionSheetCtrl: ActionSheetController) { }

  ngOnInit() {
    this.presentingElement = document.querySelector('ion-router-outlet');
    this.subscription = this.content.isDisabled.subscribe((isDisabled: boolean) => {
      this.isDisabled = isDisabled;
    })
  }

  ngAfterViewInit() {
    if(this.content.registerModal) {
      this.content.registerModal(this.modal);
    }
    this.modal.ionModalWillPresent.subscribe(() => {
      this.content.onPresent?.();
    });
    this.modal.ionModalWillDismiss.subscribe(() => {
      this.content.onDismiss?.();
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
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
      if (await this.content.submit()) {
        this.modal.dismiss(null, 'confirm');
      }
    }

    setDisabled(isDisabled: boolean) {
      this.isDisabled = isDisabled;
    }


}

export interface ModalContent {
  submit: () => Promise<boolean>,
  onPresent?: () => void,
  onDismiss?: () => void,
  registerModal?: (modal: IonModal) => void,
  isDisabled: EventEmitter<boolean>,
}
