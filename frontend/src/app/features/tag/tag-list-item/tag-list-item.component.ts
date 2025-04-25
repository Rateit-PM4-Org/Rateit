import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicStandaloneStandardImports } from '../../../shared/ionic-imports';

@Component({
  selector: 'app-tag-list-item',
  templateUrl: './tag-list-item.component.html',
  styleUrls: ['./tag-list-item.component.scss'],
  imports: [CommonModule, ...IonicStandaloneStandardImports],
})
export class TagListItemComponent {
  constructor(private readonly router: Router) { }

  @Input() tag!: {
    name: string;
    ritCount: number;
  };

  navigateToTag() {
    this.router.navigate(['/tabs/rits'], {
      queryParams: { tag: this.tag.name }
    });
  }
}
