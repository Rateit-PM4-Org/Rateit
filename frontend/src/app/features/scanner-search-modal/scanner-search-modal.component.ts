import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ModalContent } from '../modal/modal-view/modal-view.component';
import { ScannerComponent } from '../scanner/scanner.component';
import { IonicStandaloneStandardImports } from '../../shared/ionic-imports';
import { Router } from '@angular/router';
import { IonModal } from '@ionic/angular/standalone';

@Component({
  selector: 'app-scanner-search-modal',
  templateUrl: './scanner-search-modal.component.html',
  styleUrls: ['./scanner-search-modal.component.scss'],
  standalone: true,
  imports: [ScannerComponent, ...IonicStandaloneStandardImports],
})
export class ScannerSearchModalComponent  implements ModalContent {
  modal!: IonModal;
  @ViewChild(ScannerComponent) scannerComponent!: ScannerComponent;
  @Output() isDisabled = new EventEmitter<boolean>();

  constructor(private readonly router: Router) { 
    this.isDisabled = new EventEmitter<boolean>();
    this.submit = async () => {
      return true;
    };
  }

  async onScanned(scannedCodes: Set<string>) {
    console.log('Scanned codes:', scannedCodes);
    this.router.navigate(['/tabs/rits'], {
        queryParams: { barcode: Array.from(scannedCodes)[0]}
    });
    this.modal.dismiss();
  }

  registerModal(modal: IonModal) {
    this.modal = modal;
  }

  onPresent(): void {
    this.scannerComponent.start();
  }

  onDismiss(): void {
    this.scannerComponent.stop();
  }

  submit(){
    return Promise.resolve(true);
  }


}
