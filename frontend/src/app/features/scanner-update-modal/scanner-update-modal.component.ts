import {ModalContent} from '../modal/modal-view/modal-view.component';
import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {ScannerComponent} from '../scanner/scanner.component';
import {IonicStandaloneStandardImports} from '../../shared/ionic-imports';
import {IonModal} from '@ionic/angular/standalone';
import {Router} from '@angular/router';

@Component({
  selector: 'app-scanner-update-modal',
  templateUrl: './scanner-update-modal.component.html',
  styleUrls: ['./scanner-update-modal.component.scss'],
  standalone: true,
  imports: [ScannerComponent, ...IonicStandaloneStandardImports],
})
export class ScannerUpdateModalComponent implements ModalContent {
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
    this.modal.dismiss({scannedCodes: Array.from(scannedCodes)});
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

  submit() {
    return new Promise<boolean>((resolve) => {
      resolve(true);
    });
  }

}
