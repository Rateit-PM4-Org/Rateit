import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, IonModal } from '@ionic/angular/standalone';
import { IonicStandaloneStandardImports } from '../../../shared/ionic-imports';
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
  errorMessage: string = '';

  constructor(
    private readonly actionSheetCtrl: ActionSheetController
  ) { }

  ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page');
  }

  handleModalDismiss(event: CustomEvent) {
    // TODO backend call here
  }


  confirm() {
    this.modal.dismiss(
      {
        name: this.ritCreateComponent.ritName,
        details: this.ritCreateComponent.details,
        tags: this.ritCreateComponent.tags,
        image: this.ritCreateComponent.selectedImage,
      },
      'confirm'
    );
  }

  canDismiss = async () => {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Are you sure?',
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

    actionSheet.present();

    const { role } = await actionSheet.onWillDismiss();

    return role === 'confirm';
  };

}
