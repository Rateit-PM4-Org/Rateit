import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicStandaloneStandardImports } from '../../../shared/ionic-imports';

@Component({
  selector: 'app-tab-menu',
  templateUrl: './tab-menu.component.html',
  styleUrls: ['./tab-menu.component.scss'],
  standalone: true,
  imports: [
    CommonModule, ...IonicStandaloneStandardImports
  ]
})
export class TabMenuComponent {

  constructor() { }

}
