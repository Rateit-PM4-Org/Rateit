import { CommonModule } from '@angular/common';
import { Component, } from '@angular/core';
import { ToastController, ViewWillEnter } from '@ionic/angular/standalone';
import { Observable, Subscription } from 'rxjs';
import { Rit } from '../../../model/rit';
import { IonicStandaloneStandardImports } from '../../../shared/ionic-imports';
import { RitService } from '../../../shared/services/rit.service';
import { UserService } from '../../../shared/services/user.service';
import { RitListItemComponent } from '../../rit/rit-list-item/rit-list-item.component';
import { Router } from '@angular/router';
import { FabIntegrationComponent } from '../../modal/fab-integration/fab-integration.component';
import { TagListItemComponent } from "../../tag/tag-list-item/tag-list-item.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ...IonicStandaloneStandardImports,
    RitListItemComponent,
    FabIntegrationComponent,
    TagListItemComponent
],
})
export class HomeComponent implements ViewWillEnter {
  presentingElement!: HTMLElement | null;

  rits: Rit[] = [];
  numberOfLatestRitsToShow: number = 10;
  isLoggedIn$!: Observable<boolean>;

  ritSubscription: Subscription | null = null;
  ritsErrorSubscription: Subscription | null = null;

  constructor(
    private readonly ritService: RitService,
    private readonly userService: UserService,
    private readonly toastController: ToastController,
    private readonly router: Router,
  ) { }

  ionViewWillEnter() {
    this.isLoggedIn$ = this.userService.isLoggedIn();
    this.presentingElement = document.querySelector('ion-page');
    this.ritSubscription = this.ritService.getRits().subscribe({
      next: (data) => {
        this.handleLoadRitsSuccess(data);
      },
      error: (err) => {
        this.handleLoadRitsError(err);
      }
    });

    this.ritsErrorSubscription = this.ritService.getRitsErrorStream().subscribe({
      next: (err) => {
        this.handleLoadRitsError(err);
      }
    });
  }

  ionViewWillLeave() {
    this.ritSubscription?.unsubscribe();
    this.ritsErrorSubscription?.unsubscribe();
  }

  async showSuccessToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1000,
      position: 'top',
      color: 'success',
    });

    await toast.present();
  }

  async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: 'danger',
    });

    await toast.present();
  }


  private handleLoadRitsSuccess(data: Rit[]) {
    this.rits = [...data];
    // sotr by lastInteractionAt descending
    this.rits.sort((a, b) => {
      const dateA = new Date(a.lastInteractionAt ?? 0);
      const dateB = new Date(b.lastInteractionAt ?? 0);
      return dateB.getTime() - dateA.getTime();
    });
  }

  private handleLoadRitsError(err: any) {
    const baseError = err.error?.error ?? 'Unknown error';
    this.showErrorToast(baseError);
  }

  latestRits(): Rit[] {
    return this.rits.slice(0, this.numberOfLatestRitsToShow);
  }

  goToRitsTab() {
    this.router.navigate(['/rits']);
  }

  handleRefresh(event: CustomEvent) {
    this.ritService.triggerRitsReload().subscribe({
      next: () => {
        (event.target as HTMLIonRefresherElement).complete();
        this.showSuccessToast('Rits loaded successfully!');
      },
      error: () => {
        (event.target as HTMLIonRefresherElement).complete();
      }
    });
  }

  topTags() {
    return [
      { name: 'Tag Name 1', ritCount: 32 },
      { name: 'Tag Name 2', ritCount: 28 },
      { name: 'Tag Name 3', ritCount: 15 },
      { name: 'Tag Name 4', ritCount: 12 },
      { name: 'Tag Name 5', ritCount: 8 },
      { name: 'Tag Name 6', ritCount: 5 },
      { name: 'Tag Name 6', ritCount: 5 },
      { name: 'Tag Name 6', ritCount: 5 },
    ];
  }
}
