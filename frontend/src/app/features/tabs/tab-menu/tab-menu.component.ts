import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
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
  private authSubscription: Subscription | null = null;
  isAuthenticated: boolean = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly navCtrl: NavController
  ) { }

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

  navigateToTab(tab: string) {
    const currentUrl = this.router.url;
    const tabRootPath = `/tabs/${tab}`;
    
    if (currentUrl !== tabRootPath) {
      this.navCtrl.navigateRoot(tabRootPath);
    }
  }
}
