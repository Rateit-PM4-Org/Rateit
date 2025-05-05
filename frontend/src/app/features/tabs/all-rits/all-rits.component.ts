import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ToastController, ViewWillEnter } from '@ionic/angular/standalone';
import { IonicStandaloneStandardImports } from '../../../shared/ionic-imports';
import { FormsModule } from '@angular/forms';
import { RitListItemComponent } from '../../rit/rit-list-item/rit-list-item.component';
import { Rit } from '../../../model/rit';
import { RitService } from '../../../shared/services/rit.service';
import { Subscription } from 'rxjs';
import { FabIntegrationComponent } from '../../modal/fab-integration/fab-integration.component';
import { ActivatedRoute, Router } from '@angular/router';
import { RatingComparisonOperator, RitFilterOptions, RitFilterService } from '../../../shared/services/rit-filter.service';

@Component({
  selector: 'app-all-rits',
  templateUrl: './all-rits.component.html',
  styleUrls: ['./all-rits.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ...IonicStandaloneStandardImports,
    FormsModule,
    RitListItemComponent,
    FabIntegrationComponent
  ],
})

export class AllRitsComponent implements ViewWillEnter {

  filterOptions: RitFilterOptions = RitFilterService.getDefaultFilterOptions();

  rits: Rit[] = [];
  ritSubscription: Subscription | null = null;
  ritsErrorSubscription: Subscription | null = null;
  RatingComparisonOperator = RatingComparisonOperator;

  constructor(
    private readonly ritService: RitService,
    private readonly toastController: ToastController,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) { }

  ionViewWillEnter(): void {
    // Get query parameters from URL
    this.route.queryParams.subscribe(params => {
      this.filterOptions = RitFilterService.getFilterOptionsFromUrl(params);
    });

    this.ritSubscription = this.ritService.getRits().subscribe({
      next: (data) => {
        this.handleSuccess(data);
      },
      error: (err) => {
        this.handleError(err);
      }
    });

    this.ritsErrorSubscription = this.ritService.getRitsErrorStream().subscribe({
      next: (err) => {
        this.handleError(err);
      }
    });
  }

  ionViewWillLeave() {
    this.ritSubscription?.unsubscribe();
    this.ritsErrorSubscription?.unsubscribe();
  }

  filteredRits(): Rit[] {
    return RitFilterService.filterRits(this.rits, this.filterOptions);
  }

  private handleSuccess(data: Rit[]) {
    this.rits = [...data];
  }

  private handleError(err: any) {
    const baseError = err.error?.error ?? 'Unknown error';
    this.showErrorToast(baseError);
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

  onSearchChange(event: any): void {
    this.filterOptions.searchText = event.target.value;
    this.updateFilters();
  }

  updateFilters(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: RitFilterService.buildQueryParams(this.filterOptions)
    });
  }

  addTagToFilter(tag: string): void {
    if (!this.filterOptions.tags.includes(tag)) {
      this.filterOptions.tags.push(tag);
      this.updateFilters();
    }
  }

  removeTagFromFilter(tag: string): void {
    this.filterOptions.tags = this.filterOptions.tags.filter(t => t !== tag);
    this.updateFilters();
  }

  clearTagFilter(): void {
    this.filterOptions.tags = [];
    this.updateFilters();
  }

  clearFilters(event?: Event): void {
    this.filterOptions.tags = [];
    this.filterOptions.rating = 0;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: RitFilterService.buildQueryParams(this.filterOptions),
    });
    event?.stopPropagation();
  }

  setRatingFilter(value: number): void {
    // Toggle off if the same value is clicked
    this.filterOptions.rating = this.filterOptions.rating === value ? 0 : value;
    this.updateFilters();
  }

  setRatingOperator(operator: RatingComparisonOperator): void {
    if (this.filterOptions.ratingOperator === operator) { // reset to default if the same operator is clicked
      this.filterOptions.ratingOperator = RatingComparisonOperator.GreaterThanOrEqual;
      this.filterOptions.rating = 0;
    } else {
      this.filterOptions.ratingOperator = operator;
    }
    this.updateFilters();
  }

  clearRatingFilter(): void {
    this.filterOptions.rating = 0;
    this.updateFilters();
  }

  handleTagClick = (tagName: string, event: Event): void => {
    this.addTagToFilter(tagName);
    event.stopPropagation();
  }

  hasFilter(): boolean {
    return this.filterOptions.tags.length > 0 ||
      this.filterOptions.rating > 0;
  }
}
