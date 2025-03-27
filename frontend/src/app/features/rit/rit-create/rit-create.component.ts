import { Component, OnInit } from '@angular/core';
import { IonicStandaloneStandardImports } from '../../../shared/ionic-imports';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rit-create',
  templateUrl: './rit-create.component.html',
  styleUrls: ['./rit-create.component.scss'],
  standalone: true,
  imports: [CommonModule, ...IonicStandaloneStandardImports],
})
export class RitCreateComponent {

  constructor() { }

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
