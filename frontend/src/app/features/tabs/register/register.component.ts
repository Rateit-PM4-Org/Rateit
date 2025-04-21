import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { IonicStandaloneStandardImports } from '../../../shared/ionic-imports';
import { Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { ToastController } from '@ionic/angular';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
    CommonModule,ReactiveFormsModule, ...IonicStandaloneStandardImports
  ],
})
export class RegisterComponent {
  form: FormGroup = new FormGroup({
    email: new FormControl('', Validators.required),
    displayName: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });
  protected registrationErrorFields: { [key: string]: string[] } = {};
  protected registrationSuccess: boolean = false;

  constructor(private readonly router: Router, private readonly userService: UserService, private readonly toastController: ToastController) { }

  ionViewWillEnter() {
    this.reset();
  }

  reset(): void {
    this.form.reset();
    this.registrationErrorFields = {};
    this.registrationSuccess = false;
  }

  register() {
    this.userService.register(this.form.value.email, this.form.value.displayName, this.form.value.password).subscribe({
      next: response => {
        this.registrationSuccess = true;
      },
      error: err => {
        this.showErrorToast(err.error?.error ?? 'Registration Error');
        this.registrationErrorFields = err.error?.fields ?? {};
        this.form.get("password")?.setValue('');
        this.form.get("password")?.markAsPristine();
        console.error('Registration Error:', err);
      }
    })
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
}
