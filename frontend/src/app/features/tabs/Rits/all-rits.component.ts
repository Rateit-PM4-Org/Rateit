import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonSearchbar, ToastController } from '@ionic/angular/standalone';
import { IonicStandaloneStandardImports } from '../../../shared/ionic-imports';
import { FormsModule } from '@angular/forms';
import { RitListItemComponent } from '../../rit/rit-list-item/rit-list-item.component';
import { Rit } from '../../../model/rit';
import { RitService } from '../../../shared/services/rit.service';
import { ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-all-rits',
  templateUrl: './all-rits.component.html',
  styleUrls: ['./all-rits.component.scss'],
  standalone: true,
  imports: [CommonModule, ...IonicStandaloneStandardImports, IonSearchbar, FormsModule, RitListItemComponent],
})

export class AllRitsComponent implements OnInit, ViewWillEnter {
  searchText = '';
  selectedTag: string = '';
  rits: Rit[] = [];

  constructor(
    private readonly ritService: RitService,
    private readonly toastController: ToastController
  ) { }

  ionViewWillEnter(): void {
    this.loadRits();
  }

  private loadRits(): void {
    this.ritService.getAllRits().subscribe({
      next: (data) => {
        this.handleSuccess(data);
      },
      error: (err) => {
        this.handleError(err);
      }
    });
  }

  ngOnInit(): void {
    this.loadRits();
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
    this.rits = data;
  }

  private handleError(err: any) {
    this.rits = [];
    const baseError = err.error?.error ?? 'Unknown error';
    const fields = err.error?.fields;

    // if (fields) {
      // Handle field-specific errors
    // }
    this.showErrorToast(baseError);
  }

  async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1000,
      position: 'top',
      color: 'danger',
    });

    await toast.present();
  }

}
