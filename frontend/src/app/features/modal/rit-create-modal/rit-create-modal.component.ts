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

  constructor(private readonly toastController: ToastController, 
    private actionSheetCtrl: ActionSheetController,
  private readonly ritService: RitService) { }

  ngOnInit() {}

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

}
