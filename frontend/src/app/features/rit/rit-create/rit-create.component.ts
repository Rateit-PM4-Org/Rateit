import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonBackButton, IonInput, ToastController, ViewWillEnter } from '@ionic/angular/standalone';
import { IonicStandaloneStandardImports } from '../../../shared/ionic-imports';
import { RitService } from '../../../shared/services/rit.service';
import { Rit } from '../../../model/rit';

@Component({
  selector: 'app-rit-create',
  templateUrl: './rit-create.component.html',
  styleUrls: ['./rit-create.component.scss'],
  standalone: true,
  imports: [IonBackButton, CommonModule, ...IonicStandaloneStandardImports],
})
export class RitCreateComponent implements ViewWillEnter {

  constructor(
    private readonly ritService: RitService,
    private readonly route: ActivatedRoute,
    private readonly toastController: ToastController,
  ) { }

  mode?: 'create' | 'edit' | 'view';
  @Input() ritId: string | undefined;

  tags: string[] = []
  tagsErrorMessage?: string
  ritName?: string
  ritNameErrorMessage?: string
  details?: string
  detailsErrorMessage?: string

  newTag?: string

  ionViewWillEnter(): void {
    this.ritId = this.route.snapshot.paramMap.get('id') ?? undefined;

    if (this.ritId) {
      this.mode = 'view';
      this.ritService.getRit(this.ritId).subscribe((rit) => {
        this.ritName = rit.name;
        this.details = rit.details ?? '';
        this.tags = [...(rit.tags ?? [])];
      });
    } else {
      this.mode = 'create';
    }
  }

  confirmEdit() {
    this.ritService.updateRit({
      name: this.ritName,
      details: this.details,
      tags: this.tags
    }, this.ritId!).subscribe({
      next: (rit) => this.handleSuccess(rit),
      error: (err) => this.handleError(err),
    });
  }

  private handleSuccess(rit: Rit) {
    this.ritName = rit.name;
    this.details = rit.details ?? '';
    this.tags = [...(rit.tags ?? [])];

    this.showSuccessToast('Rit created updated!');
    this.mode = 'view';
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

  public setFieldErrorMessages(fields: any) {
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

  private formatFieldError(fieldError: string | string[]): string {
    return Array.isArray(fieldError) ? fieldError.join(', ') : `${fieldError}`;
  }

  setRitName(event: any) {
    this.ritName = event.target.value
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

}
