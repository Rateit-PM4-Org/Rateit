import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicStandaloneStandardImports } from '../../../shared/ionic-imports';
import { AuthService } from '../../../shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule, ...IonicStandaloneStandardImports
  ],
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  loginError: string = '';

  constructor(private readonly authService: AuthService, private readonly router: Router, private readonly route: ActivatedRoute) { }

  ngOnInit() { }

  setEmail(e: any) {
    this.email = (e.target as HTMLInputElement).value;
  }

  setPassword(e: any) {
    this.password = (e.target as HTMLInputElement).value;
  }

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: response => {
        this.email = '';
        this.password = '';
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigateByUrl(returnUrl);
      },
      error: err => {
        this.loginError = "Login failed. Please make sure that Email and password are correct."
        this.password = "";
        console.error('Login Error:', err);
      }
    })
  }

  register() {
    this.router.navigate(['/register']);
  }


}
