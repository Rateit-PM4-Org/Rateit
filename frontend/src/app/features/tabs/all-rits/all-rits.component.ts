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

export enum RatingComparisonOperator {
  GreaterThanOrEqual = 'gte',
  LessThanOrEqual = 'lte',
  Equal = 'eq'
}

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
  searchText = '';
  selectedTags: string[] = [];
  ratingFilter: number = 0; // 0 means no filter
  ratingComparisonOperator: RatingComparisonOperator = RatingComparisonOperator.GreaterThanOrEqual;
  RatingComparisonOperator = RatingComparisonOperator;
  rits: Rit[] = [];
  ritSubscription: Subscription | null = null;
  ritsErrorSubscription: Subscription | null = null;

  constructor(
    private readonly ritService: RitService,
    private readonly toastController: ToastController,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) { }

  ionViewWillEnter(): void {
    // Get query parameters from URL
    this.route.queryParams.subscribe(params => {
      this.searchText = params['search'] ?? '';
      
      // Handle tags from query params (using 'tag' parameter)
      if (params['tag']) {
        if (Array.isArray(params['tag'])) {
          this.selectedTags = params['tag'];
        } else {
          this.selectedTags = [params['tag']];
        }
      } else {
        this.selectedTags = [];
      }

      // Handle rating filter params
      this.ratingFilter = params['rating'] ? parseInt(params['rating']) : 0;

      const ratingOp = params['ratingOp'];
      if (ratingOp && Object.values(RatingComparisonOperator).includes(ratingOp as RatingComparisonOperator)) {
        this.ratingComparisonOperator = ratingOp as RatingComparisonOperator;
      } else {
        this.ratingComparisonOperator = RatingComparisonOperator.GreaterThanOrEqual;
      }
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
    return this.rits.filter(rit => {
      const matchesSearch = !this.searchText ||
        rit.name?.toLowerCase().includes(this.searchText.toLowerCase());

      // If no tags selected, show all rits
      const matchesTags = this.selectedTags.length === 0 ||
        // Otherwise, check if rit has all selected tags
        this.selectedTags.every(selectedTag =>
          rit.tags?.some(tag => tag.toLowerCase() === selectedTag.toLowerCase())
        );

      // Rating filter logic
      let matchesRating = true;
      if (this.ratingFilter > 0) {
        const latestRatingValue = this.calculateLatestRatingValue(rit.ratings ?? []);

        switch (this.ratingComparisonOperator) {
          case RatingComparisonOperator.GreaterThanOrEqual:
            matchesRating = latestRatingValue >= this.ratingFilter;
            break;
          case RatingComparisonOperator.LessThanOrEqual:
            matchesRating = latestRatingValue <= this.ratingFilter;
            break;
          case RatingComparisonOperator.Equal:
            matchesRating = latestRatingValue === this.ratingFilter;
            break;
        }
      }

      return matchesSearch && matchesTags && matchesRating;
    });
  }

  // Helper function to calculate the latest rating value for a rit
  private calculateLatestRatingValue(ratings: any[]): number {
    if (ratings.length === 0) {
      return 0;
    }
    const latestRating = ratings.reduce((prev, current) => {
      return new Date(prev.createdAt!) > new Date(current.createdAt!) ? prev : current;
    }, ratings[0]);

    return latestRating.value ?? 0;
  }

  private handleSuccess(data: Rit[]) {
    if (data.length === 0) {
      return;
    }
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
    this.searchText = event.target.value;
    this.updateFilters();
  }

  updateFilters(): void {
    const queryParams: any = {};

    if (this.searchText) {
      queryParams.search = this.searchText;
    }

    if (this.selectedTags.length > 0) {
      queryParams.tag = this.selectedTags;
    }

    if (this.ratingFilter > 0) {
      queryParams.rating = this.ratingFilter;
      queryParams.ratingOp = this.ratingComparisonOperator;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
    });
  }

  addTagToFilter(tag: string): void {
    if (!this.selectedTags.includes(tag)) {
      this.selectedTags.push(tag);
      this.updateFilters();
    }
  }

  removeTagFromFilter(tag: string): void {
    this.selectedTags = this.selectedTags.filter(t => t !== tag);
    this.updateFilters();
  }

  clearTagFilter(): void {
    this.selectedTags = [];
    this.updateFilters();
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedTags = [];
    this.ratingFilter = 0;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {}
    });
  }

  setRatingFilter(value: number): void {
    // Toggle off if the same value is clicked
    this.ratingFilter = this.ratingFilter === value ? 0 : value;
    this.updateFilters();
  }

  setRatingOperator(operator: RatingComparisonOperator): void {
    if (this.ratingComparisonOperator === operator) {
      this.ratingComparisonOperator = RatingComparisonOperator.GreaterThanOrEqual;
      this.ratingFilter = 0;
      this.updateFilters();
    } else {
      this.ratingComparisonOperator = operator;
    }
    this.updateFilters();
  }

  clearRatingFilter(): void {
    this.ratingFilter = 0;
    this.updateFilters();
  }

  handleTagClick = (tagName: string, event: Event): void => {
    this.addTagToFilter(tagName);
    event.stopPropagation();
  }

  hasFilter(): boolean {
    return this.searchText.length > 0 ||
      this.selectedTags.length > 0 ||
      this.ratingFilter > 0;
  }
}
