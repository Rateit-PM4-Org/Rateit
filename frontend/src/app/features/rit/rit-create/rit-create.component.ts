import { Component, OnInit } from '@angular/core';
import { IonicStandaloneStandardImports } from '../../../shared/ionic-imports';
import { CommonModule } from '@angular/common';
import { RateComponent } from '../rate/rate.component';
import { ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-rit-create',
  templateUrl: './rit-create.component.html',
  styleUrls: ['./rit-create.component.scss'],
  standalone: true,
  imports: [CommonModule, ...IonicStandaloneStandardImports],
})
export class RitCreateComponent {

  constructor(private modalCtrl: ModalController) { }

  selectedImage: any
  tags: any[] = ['ABC', '123']

  ritName?: string
  details?: string
  newTag?: string

  selectImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = () => {
        this.selectedImage = reader.result as string
      };
      reader.readAsDataURL(file)
    };
    input.click()
  }

  async openRateComponent() {
    const modal = await this.modalCtrl.create({
      component: RateComponent,
      breakpoints: [0, 0.25, 0.85],
      initialBreakpoint: 0.85,
      showBackdrop: true,
      canDismiss: true,
    });

    await modal.present();
  }

  onRatingButtonClick(event: Event) {
    event.stopPropagation();
    this.openRateComponent();
  }

  setRitName(event: any) {
    let input = event.target.value
    if (event.target.value) {
      this.ritName = input
    }
  }

  setDetails(event: any) {
    let input = event.target.value
    if (event.target.value) {
      this.details = input
    }
  }

  setNewTag(event: any) {
    let input = event.target.value
    if (event.target.value) {
      this.newTag = input
    }
  }

  addTag() {
    const tag = this.newTag?.trim();
    if (tag) {
      this.tags.push(tag);
      this.newTag = '';
    }
  }

  removeTag(index: number) {
    this.tags.splice(index, 1);
  }

}
