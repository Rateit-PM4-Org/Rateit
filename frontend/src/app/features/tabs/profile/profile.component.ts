import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicStandaloneStandardImports } from '../../../shared/ionic-imports';
import { UserService } from '../../../shared/services/user.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    CommonModule, ...IonicStandaloneStandardImports
  ],
})
export class ProfileComponent implements OnInit {
  profile: any;

  constructor(private readonly userService: UserService, private readonly authService: AuthService, private readonly router: Router) {
  }

  ngOnInit() {
    this.userService.getProfile().subscribe({
      next: response => {
        this.profile = response;
      },
      error: err => {
        console.error('Profile Error:', err);
      }
    })
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

}
