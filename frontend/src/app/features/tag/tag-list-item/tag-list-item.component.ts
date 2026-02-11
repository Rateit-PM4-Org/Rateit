import {Component, Input} from '@angular/core';

import {Router} from '@angular/router';
import {IonicStandaloneStandardImports} from '../../../shared/ionic-imports';

@Component({
  selector: 'app-tag-list-item',
  templateUrl: './tag-list-item.component.html',
  styleUrls: ['./tag-list-item.component.scss'],
  imports: [...IonicStandaloneStandardImports],
})
export class TagListItemComponent {
  @Input() tag!: {
    name: string;
    ritCount: number;
  };

  constructor(private readonly router: Router) {
  }

  navigateToTag() {
    this.router.navigate(['/tabs/rits'], {
      queryParams: {tag: this.tag.name}
    });
  }
}
