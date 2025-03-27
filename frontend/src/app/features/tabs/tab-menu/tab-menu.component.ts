import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicStandaloneStandardImports } from '../../../shared/ionic-imports';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-tab-menu',
  templateUrl: './tab-menu.component.html',
  styleUrls: ['./tab-menu.component.scss'],
  standalone: true,
  imports: [
    CommonModule, ...IonicStandaloneStandardImports
  ]
})
export class TabMenuComponent {
  isAuthenticated: boolean = false;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.getAuthenticationStatusObservable().subscribe({
      next: response => {
        this.isAuthenticated = response;
      }
    })
  }

}
