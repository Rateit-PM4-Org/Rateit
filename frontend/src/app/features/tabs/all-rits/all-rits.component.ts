import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ToastController, ViewWillEnter } from '@ionic/angular/standalone';
import { IonicStandaloneStandardImports } from '../../../shared/ionic-imports';
import { FormsModule } from '@angular/forms';
import { RitListItemComponent } from '../../rit/rit-list-item/rit-list-item.component';
import { Rit } from '../../../model/rit';
import { RitService } from '../../../shared/services/rit.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-all-rits',
  templateUrl: './all-rits.component.html',
  styleUrls: ['./all-rits.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ...IonicStandaloneStandardImports,
    FormsModule,
    RitListItemComponent,
  ],
})

export class AllRitsComponent implements ViewWillEnter {
  searchText = '';
  selectedTag: string = '';
  rits: Rit[] = [];
  ritSubscription: Subscription | null = null;
  ritsErrorSubscription: Subscription | null = null;

  constructor(
    private readonly ritService: RitService,
    private readonly toastController: ToastController
  ) { }

  ionViewWillEnter(): void {
    this.ritSubscription = this.ritService.getRits().subscribe({
      next: (data) => {
        this.handleSuccess(data);
      },
      error: (err) => {
        this.handleError(err);
      }
    });

    this.ritsErrorSubscription = this.ritService.getRitsErrorStream().subscribe({
      next: (err) => {
        this.handleError(err);
      }
    });
  }

  ionViewWillLeave() {
    this.ritSubscription?.unsubscribe();
    this.ritsErrorSubscription?.unsubscribe();
  }

  filteredRits(): Rit[] {
    return this.rits.filter(rit =>
      rit.name?.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  private handleSuccess(data: Rit[]) {
    if (data.length === 0) {
      return;
    }
    this.rits = [...data];
  }

  private handleError(err: any) {
    const baseError = err.error?.error ?? 'Unknown error';
    this.showErrorToast(baseError);
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
