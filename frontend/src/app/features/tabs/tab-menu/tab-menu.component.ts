import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonicStandaloneStandardImports } from '../../../shared/ionic-imports';
import { AuthService } from '../../../shared/services/auth.service';
import { Subscription } from 'rxjs';

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
  private authSubscription: Subscription|null = null;
  isAuthenticated: boolean = false;
  constructor(private readonly authService: AuthService) { }

  ionViewWillEnter() {
    this.authSubscription = this.authService.getAuthenticationStatusObservable().subscribe({
      next: response => {
        this.isAuthenticated = response;
      }
    })
  }

  ionViewWillLeave() {
    this.authSubscription?.unsubscribe();
  }
}
