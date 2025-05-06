import { Component, OnInit } from '@angular/core';
import { IonicStandaloneStandardImports } from '../../../shared/ionic-imports';
import { ScannerComponent } from '../../scanner/scanner.component';
import { ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scannertest',
  templateUrl: './scannertest.component.html',
  styleUrls: ['./scannertest.component.scss'],
  standalone: true,
  imports: [...IonicStandaloneStandardImports, ScannerComponent, CommonModule],
})
export class ScannertestComponent  implements OnInit {

  protected scannedCodes: Array<string> = new Array<string>();

  constructor(private toastController: ToastController) { }

  ngOnInit() {}

  async onScanned(scannedCodes: Set<string>) {
    const message = Array.from(scannedCodes).join(', ');
    scannedCodes.forEach((code) => {
      this.scannedCodes.push(code);
    })

    const toast = await this.toastController.create({
      message: `Scanned codes: ${message}`,
      duration: 4000,
      position: 'top',
      color: 'success'
    });

    await toast.present();
  }
}
