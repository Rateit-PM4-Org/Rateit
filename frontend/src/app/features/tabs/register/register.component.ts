import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicStandaloneStandardImports } from '../../../shared/ionic-imports';
import { Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
    CommonModule, ...IonicStandaloneStandardImports
  ],
})
export class RegisterComponent  implements OnInit {
  protected email: string = '';
  private displayName: string = '';
  protected password: string = '';
  private passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_\-+=?.:,])[A-Za-z\d!@#$%^&*_\-+=?.:,]+$/;
  private emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  protected hasRegistrationError: boolean = false;
  protected isEmailValid: boolean = true;
  protected isPasswordValid: boolean = true;

  constructor(private readonly router: Router, private readonly userService: UserService) { }

  ngOnInit() { }

  setEmail(e: any) {
    this.email = (e.target as HTMLInputElement).value;
    this.isEmailValid = this.emailRegex.test(this.email);
  }

  setDisplayName(e: any) {
    this.displayName = (e.target as HTMLInputElement).value;
  }

  setPassword(e: any) {
    this.password = (e.target as HTMLInputElement).value;
    this.isPasswordValid = this.passwordRegex.test(this.password);
  }

  register() {
    this.userService.register(this.email, this.displayName, this.password).subscribe({
      next: response => {
        this.router.navigateByUrl("/login");
      },
      error: err => {
        console.error('Registration Error:', err);
        this.hasRegistrationError = true;
        this.password = '';
      }
    })
  }
}
