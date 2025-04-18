import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicStandaloneStandardImports } from '../../../shared/ionic-imports';

@Component({
  selector: 'app-tag-list-item',
  templateUrl: './tag-list-item.component.html',
  styleUrls: ['./tag-list-item.component.scss'],
  imports: [CommonModule, ...IonicStandaloneStandardImports],
})
export class TagListItemComponent {
  navigateToTag() {
    console.log('Navigating to tag:', this.tag.name);
  }
  @Input() tag!: { name: string; ritCount: number };
}
