import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, IonModal } from '@ionic/angular/standalone';
import { IonicStandaloneStandardImports } from '../../../shared/ionic-imports';
import { RitCreateComponent } from '../../rit/rit-create/rit-create.component';
import { Rit } from '../../../model/rit';
import { RitService } from '../../../shared/services/rit.service';

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
    private readonly actionSheetCtrl: ActionSheetController, private readonly ritService: RitService
  ) { }

  ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page');
  }

  handleModalDismiss(event: CustomEvent) {
    let data = event.detail.data

    if (data.name) {
      let request: Rit = {
        name: data.name,
        details: data.details,
        published: data.published === 'published' ? true : false
      }
      this.ritService.createRit(request).subscribe({
        next: (rit) => console.log('Erstellt:', rit),
        error: (err) => console.error('Fehler:', err),
      });
    }
    
  }


  confirm() {
    this.modal.dismiss(
      {
        name: this.ritCreateComponent.ritName,
        details: this.ritCreateComponent.details,
        published: this.ritCreateComponent.published,
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
