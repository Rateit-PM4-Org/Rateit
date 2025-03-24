import { Component, OnInit } from '@angular/core';
import { IonicStandaloneStandardImports } from '../../../shared/ionic-imports';

@Component({
  selector: 'app-rit-create',
  templateUrl: './rit-create.component.html',
  styleUrls: ['./rit-create.component.scss'],
  standalone: true,
  imports: [...IonicStandaloneStandardImports],
})
export class RitCreateComponent  implements OnInit {

  constructor() {}

  ngOnInit() {
  }

  ritName: string = 'Rit Name...';
  ritDetails: string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
  rating: number = 4;

  onRateClick() {
    console.log('Rating clicked');
  }

}
