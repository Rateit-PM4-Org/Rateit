import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicStandaloneStandardImports } from '../../../shared/ionic-imports';

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.scss'],
  imports: [CommonModule, ...IonicStandaloneStandardImports],
  standalone: true,
})
export class RateComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
