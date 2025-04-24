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
  numberOfTopTagsToShow: number = 4;
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
      const dateA = this.calculateLastInteractionAt(a);
      const dateB = this.calculateLastInteractionAt(b);
      return dateB.getTime() - dateA.getTime();
    });
  }
  private calculateLastInteractionAt(rit: Rit): Date {
    const latestRatingDate = rit.ratings?.reduce((latest, rating) => {
      const ratingDate = new Date(rating.createdAt ?? 0);
      return ratingDate > latest ? ratingDate : latest;
    }, new Date(0)) ?? new Date(0);
    
    const lastModified = new Date(rit.updatedAt ?? 0);
    return latestRatingDate > lastModified ? latestRatingDate : lastModified;
  }

  private handleLoadRitsError(err: any) {
    const baseError = err.error?.error ?? 'Unknown error';
    this.showErrorToast(baseError);
  }

  latestRits(): Rit[] {
    return this.rits.slice(0, this.numberOfLatestRitsToShow);
  }

  goToRitsTab() {
    this.router.navigate(['/tabs/rits']);
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
    const tagMap: { [tagName: string]: { ritCount: number; latestInteraction: Date } } = {};

    // Iterate through the sorted Rits and track the latest interaction and count for each tag
    this.rits.forEach(rit => {
      const ritDate = new Date(rit.updatedAt ?? 0);
      rit.tags?.forEach(tag => {
        if (!tagMap[tag]) {
          tagMap[tag] = { ritCount: 0, latestInteraction: ritDate };
        }
        tagMap[tag].ritCount += 1;
        if (ritDate > tagMap[tag].latestInteraction) {
          tagMap[tag].latestInteraction = ritDate;
        }
      });
    });

    // Convert the tag map to an array and sort by latest interaction, then by rit count
    const sortedTags = Object.entries(tagMap)
      .map(([name, { ritCount, latestInteraction }]) => ({ name, ritCount, latestInteraction }))
      .sort((a, b) => {
        const dateDiff = b.latestInteraction.getTime() - a.latestInteraction.getTime();
        return dateDiff !== 0 ? dateDiff : b.ritCount - a.ritCount;
      });

    // Return the top tags
    return sortedTags.slice(0, this.numberOfTopTagsToShow).map(({ name, ritCount }) => ({ name, ritCount }));
  }
}
