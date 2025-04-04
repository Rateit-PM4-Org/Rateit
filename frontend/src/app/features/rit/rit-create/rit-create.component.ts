import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { IonicStandaloneStandardImports } from '../../../shared/ionic-imports';
import { RateComponent } from '../rate/rate.component';

@Component({
  selector: 'app-rit-create',
  templateUrl: './rit-create.component.html',
  styleUrls: ['./rit-create.component.scss'],
  standalone: true,
  imports: [CommonModule, ...IonicStandaloneStandardImports],
})
export class RitCreateComponent {

  constructor() { }

  tags: string[] = ['']
  ritName?: string
  details?: string
  newTag?: string

  setRitName(event: any) {
    let input = event.target.value
    if (input) {
      this.ritName = input
    }
  }

  setDetails(event: any) {
    let input = event.target.value
    if (input) {
      this.details = input
    }
  }

  setNewTag(event: any) {
    let input = event.target.value
    if (input) {
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
