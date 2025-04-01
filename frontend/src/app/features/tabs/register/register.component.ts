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
  private email: string = '';
  private displayName: string = '';
  private password: string = '';
  protected errorMessage: string = '';

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
        this.router.navigateByUrl("/login");
      },
      error: err => {
        console.error('Registration Error:', err);
        this.errorMessage = err.message;
      }
    })
  }

}
