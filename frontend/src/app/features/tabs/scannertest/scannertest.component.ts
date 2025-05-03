import { Component, OnInit } from '@angular/core';
import { IonicStandaloneStandardImports } from '../../../shared/ionic-imports';
import { ScannerComponent } from '../../scanner/scanner.component';

@Component({
  selector: 'app-scannertest',
  templateUrl: './scannertest.component.html',
  styleUrls: ['./scannertest.component.scss'],
  standalone: true,
  imports: [...IonicStandaloneStandardImports, ScannerComponent],
})
export class ScannertestComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
