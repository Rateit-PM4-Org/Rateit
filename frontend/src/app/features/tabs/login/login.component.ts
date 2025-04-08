import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicStandaloneStandardImports } from '../../../shared/ionic-imports';
import { AuthService } from '../../../shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, ...IonicStandaloneStandardImports
  ],
})
export class LoginComponent implements OnInit {
  form: FormGroup = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  loginErrorFields: { [key: string]: string } = {};

  constructor(private readonly authService: AuthService, private readonly router: Router, private readonly route: ActivatedRoute, private readonly toastController:ToastController) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.route.snapshot.queryParams['emailConfirmed'] && this.showSuccessToast('Email confirmed successfully!');
    this.router.navigate(['/login'], { queryParams: { emailConfirmed: null } });
    this.reset();
  }

  reset(): void {
    this.form.reset();
    this.loginErrorFields = {};
  }

  login() {
    this.authService.login(this.form.value.email, this.form.value.password).subscribe({
      next: response => {
        this.form.reset();
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigateByUrl(returnUrl);
      },
      error: err => {
        this.showErrorToast(err.error?.error || 'Login Error');
        this.form.get("password")?.setValue('');
        this.form.get("password")?.markAsPristine();        
        this.loginErrorFields = err.error?.fields || {};
        console.error('Login Error:', err);
      }
    })
  }

  register() {
    this.router.navigate(['/register']);
  }

  async showSuccessToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
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
}
