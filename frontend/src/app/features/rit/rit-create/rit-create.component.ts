import {CommonModule} from '@angular/common';
import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {IonBackButton, ToastController, ViewWillEnter} from '@ionic/angular/standalone';
import {Rit} from '../../../model/rit';
import {IonicStandaloneStandardImports} from '../../../shared/ionic-imports';
import {RitService} from '../../../shared/services/rit.service';
import {ModalContent, ModalViewComponent} from '../../modal/modal-view/modal-view.component';
import {TagSelectorComponent} from '../../tag/tag-selector/tag-selector.component';
import {ScannerUpdateModalComponent} from '../../scanner-update-modal/scanner-update-modal.component';

@Component({
  selector: 'app-rit-create',
  templateUrl: './rit-create.component.html',
  styleUrls: ['./rit-create.component.scss'],
  standalone: true,
  imports: [IonBackButton, CommonModule, TagSelectorComponent, ...IonicStandaloneStandardImports, ModalViewComponent, ScannerUpdateModalComponent],
})
export class RitCreateComponent implements ViewWillEnter, ModalContent {

  mode?: 'create' | 'edit' | 'view' = 'create';
  @Input() ritId: string | undefined;
  @Output() isDisabled = new EventEmitter<boolean>();
  @ViewChild("ritUpdateModal") ritUpdateModal!: ModalViewComponent;
  tags: string[] = []
  tagsErrorMessage?: string
  codes: string[] = []
  codesErrorMessage?: string
  ritName?: string
  ritNameErrorMessage?: string
  details?: string
  detailsErrorMessage?: string

  constructor(
    private readonly ritService: RitService,
    private readonly route: ActivatedRoute,
    private readonly toastController: ToastController,
  ) {
  }

  ionViewWillEnter(): void {
    this.ritId = this.route.snapshot.paramMap.get('ritId') ?? undefined;

    if (this.ritId) {
      this.mode = 'view';
      this.ritService.getRit(this.ritId).subscribe((rit) => {
        this.ritName = rit.name;
        this.details = rit.details ?? '';
        this.tags = [...(rit.tags ?? [])];
        this.codes = [...(rit.codes ?? [])];
      });
    }
  }

  updateRit() {
    this.ritService.updateRit(this.buildRequest(), this.ritId!).subscribe({
      next: (rit) => this.handleSuccess(rit, 'Rit updated successfully!'),
      error: (err) => this.handleError(err),
    });
  }

  submit(): Promise<boolean> {
    return this.createRit();
  }

  createRit(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.ritService.createRit(this.buildRequest()).subscribe({
        next: (rit) => {
          this.handleSuccess(rit, 'Rit created successfully!');
          this.ritId = undefined;
          this.ritName = undefined;
          this.details = undefined;
          this.tags = [];
          this.codes = [];
          resolve(true);
        },
        error: (err) => {
          this.handleError(err);
          resolve(false);
        },
      });
    });
  }

  async showSuccessToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: 'success',
    });

    await toast.present();
  }

  async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      position: 'top',
      color: 'danger',
    });

    await toast.present();
  }

  async openScanner() {
    this.ritUpdateModal.modal.present();
    const {data} = await this.ritUpdateModal.modal.onDidDismiss();
    this.addCodes(data.scannedCodes);
  }

  setRitName(event: any) {
    this.ritName = event.target.value
    this.validateFields()
  }

  setDetails(event: any) {
    this.details = event.target.value
  }

  addCodes(newCodes: string[]) {
    const uniqueCodes = new Set(this.codes);
    newCodes.forEach(code => uniqueCodes.add(code));
    this.codes = Array.from(uniqueCodes);
  }

  removeCode(code: string) {
    this.codes = this.codes.filter(c => c !== code);
  }

  onTagsChange(newTags: string[]) {
    this.tags = newTags;
  }

  validateFields() {
    this.isDisabled.emit(!this.ritName);
  }

  private buildRequest(): Rit {
    return {
      name: this.ritName,
      details: this.details,
      tags: this.tags ?? [],
      codes: this.codes ?? [],
    };
  }

  private handleSuccess(rit: Rit, toastMessage: string) {
    this.ritName = rit.name;
    this.details = rit.details ?? '';
    this.tags = [...(rit.tags ?? [])];
    this.codes = [...(rit.codes ?? [])];

    this.showSuccessToast(toastMessage);
    this.ritService.triggerRitsReload().subscribe({});

    if (this.mode !== 'create') {
      this.mode = 'view';
    }
  }

  private handleError(err: any) {
    const baseError = err.error?.error ?? 'Unknown error';
    const fields = err.error?.fields;

    if (fields) {
      this.setFieldErrorMessages(fields);
    } else {
      this.showErrorToast(baseError);
    }
  }

  private setFieldErrorMessages(fields: any) {
    if (fields.name) {
      this.ritNameErrorMessage = this.formatFieldError(fields.name);
    }
    if (fields.details) {
      this.detailsErrorMessage = this.formatFieldError(fields.details);
    }
    if (fields.tags) {
      this.tagsErrorMessage = this.formatFieldError(fields.tags);
    }
    if (fields.codes) {
      this.codesErrorMessage = this.formatFieldError(fields.codes);
    }
  }

  private formatFieldError(fieldError: string | string[]): string {
    return Array.isArray(fieldError) ? fieldError.join(', ') : `${fieldError}`;
  }

}
