import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicStandaloneComponents } from '../../../shared/ionic-imports';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    CommonModule, ...IonicStandaloneComponents
  ],
})
export class ProfileComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
