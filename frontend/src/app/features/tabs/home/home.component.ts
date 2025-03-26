import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, IonModal } from '@ionic/angular/standalone';
import { catchError, of } from 'rxjs';
import { IonicStandaloneStandardImports } from '../../../shared/ionic-imports';
import { ApiService } from '../../../shared/services/api.service';
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
    private readonly apiService: ApiService,
    private readonly actionSheetCtrl: ActionSheetController
  ) { }

  ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page');

    this.apiService.getData().pipe(
      catchError(error => {

        console.error('Error fetching data:', error);
        this.errorMessage = 'Failed to fetch data from backend';
        return of([]); // Return an empty array in case of error
      })
    ).subscribe({
      next: response => {
        console.log('API Response:', response);
        this.data = response; // Assign the response directly
      },
      error: err => {
        console.error('Subscription Error:', err);
        this.errorMessage = 'An error occurred';
      }
    });
  }

  handleModalDismiss(event: CustomEvent) {
    const role = event.detail.role;
    const data = event.detail.data;

    if (role === 'confirm') {

      // TODO add backend call here
      console.log('To be created');
      console.log('Name: ', data?.name);
      console.log('Details: ', data?.details);
      console.log('Tags: ', data?.tags);
      console.log('Image: ', data?.image);
    }
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
