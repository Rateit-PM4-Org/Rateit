import { Component, OnInit } from '@angular/core';
import { IonicStandaloneComponents } from '../../../shared/ionic-imports';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab-menu',
  standalone: true,
  imports: [
    CommonModule, ...IonicStandaloneComponents
  ],
  templateUrl: './tab-menu.component.html',
})
export class TabMenuComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
