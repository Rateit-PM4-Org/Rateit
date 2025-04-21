import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonBackButton, IonInput, NavController, ToastController, ViewWillEnter } from '@ionic/angular/standalone';
import { Rit } from '../../../model/rit';
import { IonicStandaloneStandardImports } from '../../../shared/ionic-imports';
import { RitService } from '../../../shared/services/rit.service';
import { ModalContent } from '../../modal/modal-view/modal-view.component';

@Component({
  selector: 'app-rit-create',
  templateUrl: './rit-create.component.html',
  styleUrls: ['./rit-create.component.scss'],
  standalone: true,
  imports: [IonBackButton, CommonModule, ...IonicStandaloneStandardImports],
})
export class RitCreateComponent implements ViewWillEnter, ModalContent {

  constructor(
    private readonly ritService: RitService,
    private readonly route: ActivatedRoute,
    private readonly navController: NavController,
    private readonly toastController: ToastController,
  ) { }

  mode?: 'create' | 'edit' | 'view' = 'create';
  @Input() ritId: string | undefined;
  @Output() isDisabled = new EventEmitter<boolean>();

  tags: string[] = []
  tagsErrorMessage?: string
  ritName?: string
  ritNameErrorMessage?: string
  details?: string
  detailsErrorMessage?: string

  newTag?: string

  ionViewWillEnter(): void {
    this.ritId = this.route.snapshot.paramMap.get('ritId') ?? undefined;

    if (this.ritId) {
      this.mode = 'view';
      this.ritService.getRit(this.ritId).subscribe((rit) => {
        this.ritName = rit.name;
        this.details = rit.details ?? '';
        this.tags = [...(rit.tags ?? [])];
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
          resolve(true);
        },
        error: (err) => {
          this.handleError(err);
          resolve(false);
        },
      });
    });
  }

  private buildRequest(): Rit {
    return {
      name: this.ritName,
      details: this.details,
      tags: this.tags ?? [],
    };
  }

  private handleSuccess(rit: Rit, toastMessage: string) {
    this.ritName = rit.name;
    this.details = rit.details ?? '';
    this.tags = [...(rit.tags ?? [])];

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

  private formatFieldError(fieldError: string | string[]): string {
    return Array.isArray(fieldError) ? fieldError.join(', ') : `${fieldError}`;
  }

  setRitName(event: any) {
    this.ritName = event.target.value
    this.validateFields()
  }

  setDetails(event: any) {
    this.details = event.target.value
  }

  setNewTag(event: any) {
    let input = event.target.value
    if (input) {
      this.newTag = input
    }
  }

  addTag(inputEl: IonInput, action: string) {
    const tag = this.newTag?.trim();
    if (tag && !this.tags.includes(tag)) {
      this.tags.push(tag)
      if (action === 'enter') {
        setTimeout(() => inputEl.setFocus(), 100)
      }
    }
    this.newTag = ''
  }

  removeTag(index: number) {
    this.tags.splice(index, 1)
  }

  validateFields() {
    this.isDisabled.emit(!this.ritName);
  }

  goBack() {
    this.navController.back({ animated: false });
  }

}
