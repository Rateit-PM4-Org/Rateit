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
  protected registrationErrorMessage: string = '';
  protected registrationErrorFields: { [key: string]: string } = {};
  protected registrationSuccess: boolean = false;

  constructor(private readonly router: Router, private readonly userService: UserService) { }

  ngOnInit() { }

  setEmail(e: any) {
    this.email = (e.target as HTMLInputElement).value;
  }

  setDisplayName(e: any) {
    this.displayName = (e.target as HTMLInputElement).value;
  }

  setPassword(e: any) {
    this.password = (e.target as HTMLInputElement).value;
  }

  register() {
    this.userService.register(this.email, this.displayName, this.password).subscribe({
      next: response => {
        this.registrationSuccess = true;
      },
      error: err => {
        this.registrationErrorMessage = err.error?.error || 'Registration Error';
        this.registrationErrorFields = err.error?.fields || {};
        this.password = '';
        console.error('Registration Error:', err);
      }
    })
  }
}
