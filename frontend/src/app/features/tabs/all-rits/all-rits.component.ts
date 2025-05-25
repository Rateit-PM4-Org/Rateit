import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {ToastController, ViewWillEnter, ViewWillLeave} from '@ionic/angular/standalone';
import {IonicStandaloneStandardImports} from '../../../shared/ionic-imports';
import {FormsModule} from '@angular/forms';
import {RitListItemComponent} from '../../rit/rit-list-item/rit-list-item.component';
import {Rit} from '../../../model/rit';
import {RitService} from '../../../shared/services/rit.service';
import {Subscription} from 'rxjs';
import {FabIntegrationComponent} from '../../modal/fab-integration/fab-integration.component';
import {ActivatedRoute, Router} from '@angular/router';
import {
  RatingComparisonOperator,
  RitFilterService,
  RitSortAndFilterOptions,
  SortDirection,
  SortOptionOperator
} from '../../../shared/services/rit-filter.service';

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

export class AllRitsComponent implements ViewWillEnter, ViewWillLeave {

  sortAndFilterOptions: RitSortAndFilterOptions = RitFilterService.getDefaultSortAndFilterOptions();

  rits: Rit[] = [];
  ritSubscription: Subscription | null = null;
  ritsErrorSubscription: Subscription | null = null;
  RatingComparisonOperator = RatingComparisonOperator;
  SortOptionOperator = SortOptionOperator;

  constructor(
    private readonly ritService: RitService,
    private readonly toastController: ToastController,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
  }

  ionViewWillEnter(): void {
    // Get query parameters from URL
    this.route.queryParams.subscribe(params => {
      this.sortAndFilterOptions = RitFilterService.getFilterOptionsFromUrl(params);
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
    return RitFilterService.filterRits(this.rits, this.sortAndFilterOptions);
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
    this.sortAndFilterOptions.searchText = event.target.value;
    this.updateFilters();
  }

  updateFilters(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: RitFilterService.buildQueryParams(this.sortAndFilterOptions)
    });
  }

  addTagToFilter(tag: string): void {
    if (!this.sortAndFilterOptions.tags.includes(tag)) {
      this.sortAndFilterOptions.tags.push(tag);
      this.updateFilters();
    }
  }

  removeTagFromFilter(tag: string): void {
    this.sortAndFilterOptions.tags = this.sortAndFilterOptions.tags.filter(t => t !== tag);
    this.updateFilters();
  }

  clearTagFilter(): void {
    this.sortAndFilterOptions.tags = [];
    this.updateFilters();
  }

  clearFilters(event?: Event): void {
    this.sortAndFilterOptions.tags = [];
    this.sortAndFilterOptions.rating = 0;
    this.sortAndFilterOptions.ratingOperator = RatingComparisonOperator.GreaterThanOrEqual;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: RitFilterService.buildQueryParams(this.sortAndFilterOptions),
    });
    event?.stopPropagation();
  }

  setRatingFilter(value: number): void {
    // Toggle off if the same value is clicked
    this.sortAndFilterOptions.rating = this.sortAndFilterOptions.rating === value ? 0 : value;
    this.updateFilters();
  }

  setRatingOperator(operator: RatingComparisonOperator): void {
    if (this.sortAndFilterOptions.ratingOperator === operator) { // reset to default if the same operator is clicked
      this.sortAndFilterOptions.ratingOperator = RatingComparisonOperator.GreaterThanOrEqual;
      this.sortAndFilterOptions.rating = 0;
    } else {
      this.sortAndFilterOptions.ratingOperator = operator;
    }
    this.updateFilters();
  }

  clearRatingFilter(): void {
    this.sortAndFilterOptions.rating = 0;
    this.updateFilters();
  }

  handleTagClick = (tagName: string, event: Event): void => {
    this.addTagToFilter(tagName);
    event.stopPropagation();
  }

  hasFilter(): boolean {
    return this.sortAndFilterOptions.tags.length > 0 ||
      this.sortAndFilterOptions.rating > 0 || this.sortAndFilterOptions.barcode.length > 0 || this.sortAndFilterOptions.ratingOperator === RatingComparisonOperator.NoRating;
  }

  setSortOptionOperator(newOption: SortOptionOperator): void {
    if (this.sortAndFilterOptions.sortOptionOperator === newOption) {
      this.sortAndFilterOptions.sortDirection = this.sortAndFilterOptions.sortDirection === SortDirection.Descending ? SortDirection.Ascending : SortDirection.Descending;
    } else {
      this.sortAndFilterOptions.sortDirection = SortDirection.Descending;
      this.sortAndFilterOptions.sortOptionOperator = newOption;
    }
    this.updateFilters();
  }

  toggleNoRatingFilter() {
    if (this.sortAndFilterOptions.ratingOperator === RatingComparisonOperator.NoRating) {
      this.sortAndFilterOptions.ratingOperator = RatingComparisonOperator.GreaterThanOrEqual;
    } else {
      this.sortAndFilterOptions.ratingOperator = RatingComparisonOperator.NoRating;
    }
    this.sortAndFilterOptions.rating = 0;
    this.updateFilters();
  }

  private handleSuccess(data: Rit[]) {
    this.rits = [...data];
  }

  private handleError(err: any) {
    const baseError = err.error?.error ?? 'Unknown error';
    this.showErrorToast(baseError);
  }
}
