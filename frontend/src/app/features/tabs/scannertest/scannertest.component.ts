import { Component, OnInit } from '@angular/core';
import { IonicStandaloneStandardImports } from '../../../shared/ionic-imports';
import { ScannerComponent } from '../../scanner/scanner.component';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-scannertest',
  templateUrl: './scannertest.component.html',
  styleUrls: ['./scannertest.component.scss'],
  standalone: true,
  imports: [...IonicStandaloneStandardImports, ScannerComponent],
})
export class ScannertestComponent  implements OnInit {

  constructor(private toastController: ToastController) { }

  ngOnInit() {}

  async onScanned(scannedCodes: Set<string>) {
    const message = Array.from(scannedCodes).join(', ');

    const toast = await this.toastController.create({
      message: `Scanned codes: ${message}`,
      duration: 4000,
      position: 'top',
      color: 'success'
    });

    await toast.present();
  }
}
