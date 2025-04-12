import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonInput } from '@ionic/angular/standalone';
import { IonicStandaloneStandardImports } from '../../../shared/ionic-imports';

@Component({
  selector: 'app-rit-create',
  templateUrl: './rit-create.component.html',
  styleUrls: ['./rit-create.component.scss'],
  standalone: true,
  imports: [CommonModule, ...IonicStandaloneStandardImports],
})
export class RitCreateComponent {

  constructor() { }

  tags: string[] = []
  tagsErrorMessage?: string
  ritName?: string
  ritNameErrorMessage?: string
  details?: string
  detailsErrorMessage?: string

  newTag?: string

  setRitName(event: any) {
    this.ritName = event.target.value
  }

  setDetails(event: any) {
    this.details = event.target.value
  }

  setNewTag(event: any) {
    let input = event.target.value
    if (input) {
      this.newTag = input
    }
  }

  addTag(inputEl: IonInput, action: string) {
    const tag = this.newTag?.trim();
    if (tag && !this.tags.includes(tag)) {
      this.tags.push(tag)
      if (action === 'enter') {
        setTimeout(() => inputEl.setFocus(), 100)
      }
    }
    this.newTag = ''
  }

  removeTag(index: number) {
    this.tags.splice(index, 1)
  }

}
