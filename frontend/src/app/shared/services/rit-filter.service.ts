import { Injectable } from '@angular/core';
import { Rit } from '../../model/rit';

export enum RatingComparisonOperator {
  GreaterThanOrEqual = 'gte',
  LessThanOrEqual = 'lte',
  Equal = 'eq',
  NoRating = 'noTag'
}

export enum SortOptionOperator {
  DateCreated = 'dateCreated',
  LastUpdated = 'lastUpdated',
  Rating = 'rating',
  Name = 'name'
}

export enum SortDirection {
  Ascending = 'asc',
  Descending = 'desc'
}

export interface RitSortAndFilterOptions {
  searchText: string;
  tags: string[];
  rating: number;
  barcode: string;
  ratingOperator: RatingComparisonOperator;
  sortOptionOperator: SortOptionOperator;
  sortDirection: SortDirection;
}

@Injectable({
  providedIn: 'root'
})
export class RitFilterService {

  constructor() { }

  public static filterRits(rits: Rit[], options: RitSortAndFilterOptions): Rit[] {
    // Filter the rits first
    const filteredRits = rits.filter(rit => {
      const matchesSearch = !options.searchText ||
        rit.name?.toLowerCase().includes(options.searchText.toLowerCase());

      const matchesTags = !options.tags?.length ||
        options.tags.every(tag =>
          rit.tags?.some(ritTag => ritTag.toLowerCase() === tag.toLowerCase())
        );

      const matchesBarcode = !options.barcode ||
        rit.codes?.includes(options.barcode);

      // Rating filter logic
      let matchesRating = true;

      if (options.ratingOperator === RatingComparisonOperator.NoRating) {
        const latestRatingValue = this.getLatestRatingValue(rit);
        matchesRating = latestRatingValue === 0;
      } else if (options.rating && options.rating > 0) {
        const latestRatingValue = this.getLatestRatingValue(rit);

        switch (options.ratingOperator) {
          case RatingComparisonOperator.GreaterThanOrEqual:
            matchesRating = latestRatingValue >= options.rating;
            break;
          case RatingComparisonOperator.LessThanOrEqual:
            matchesRating = latestRatingValue <= options.rating;
            break;
          case RatingComparisonOperator.Equal:
            matchesRating = latestRatingValue === options.rating;
            break;
        }
      }

      return matchesSearch && matchesTags && matchesRating && matchesBarcode;
    });

    // Then sort the filtered results
    return this.sortRits(filteredRits, options);
  }

  private static sortRits(rits: Rit[], options: RitSortAndFilterOptions): Rit[] {

    rits.sort((a, b) => {
      let comparison = 0;

      switch (options.sortOptionOperator) {
        case SortOptionOperator.DateCreated: {
          // Sort by creation date
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          comparison = dateA.getTime() - dateB.getTime();
          break;
        }

        case SortOptionOperator.LastUpdated: {
          // Use calculateLastInteractionAt for last update date
          const lastInteractionA = this.calculateLastInteractionAt(a).getTime();
          const lastInteractionB = this.calculateLastInteractionAt(b).getTime();
          comparison = lastInteractionA - lastInteractionB;
          break;
        }

        case SortOptionOperator.Rating: {
          // Sort by rating
          const ratingA = this.getLatestRatingValue(a);
          const ratingB = this.getLatestRatingValue(b);
          comparison = ratingA - ratingB;
          break;
        }

        case SortOptionOperator.Name: {
          // Sort by name
          const nameA = a.name?.toLowerCase() || '';
          const nameB = b.name?.toLowerCase() || '';
          comparison = nameA.localeCompare(nameB);
          break;
        }

        default: {
          // Default to creation date if an unsupported sort option is provided
          const defaultDateA = new Date(a.createdAt || 0);
          const defaultDateB = new Date(b.createdAt || 0);
          comparison = defaultDateA.getTime() - defaultDateB.getTime();
          break;
        }
      }

      // Apply sort direction
      if (options.sortDirection === SortDirection.Descending) {
        comparison = -comparison; // Invert the comparison for descending order
      }

      return comparison;
    });

    return rits;
  }

  private static getLatestRatingValue(rit: Rit): number {
    if (!rit.ratings?.length) {
      return 0;
    }

    const latestRating = rit.ratings.reduce((prev, current) => {
      return new Date(prev.createdAt!) > new Date(current.createdAt!) ? prev : current;
    }, rit.ratings[0]);

    return latestRating.value ?? 0;
  }

  public static calculateLastInteractionAt(rit: Rit): Date {
    const latestRatingDate = rit.ratings?.reduce((latest, rating) => {
      const ratingDate = new Date(rating.createdAt ?? 0);
      return ratingDate > latest ? ratingDate : latest;
    }, new Date(0)) ?? new Date(0);

    const lastModified = new Date(rit.updatedAt ?? 0);
    return latestRatingDate > lastModified ? latestRatingDate : lastModified;
  }

  public static getFilterOptionsFromUrl(params: any): RitSortAndFilterOptions {
    const options = this.getDefaultSortAndFilterOptions();
    if (!params) {
      return options;
    }

    if (params['search']) {
      options.searchText = params['search'];
    }

    if (params['tag']) {
      options.tags = Array.isArray(params['tag'])
        ? params['tag']
        : [params['tag']];
    }

    if (params['rating']) {
      options.rating = parseInt(params['rating']);
    }

    if (params['ratingOp']) {
      options.ratingOperator = params['ratingOp'] as RatingComparisonOperator;
    }

    if (params['sort']) {
      options.sortOptionOperator = params['sort'] as SortOptionOperator;
    }

    if (params['sortDir']) {
      options.sortDirection = params['sortDir'] as SortDirection;
    }

    if (params['barcode']) {
      options.barcode = params['barcode'];
    }

    return options;
  }

  public static buildQueryParams(options: RitSortAndFilterOptions): any {
    const queryParams: any = {};
    const defaultOptions = this.getDefaultSortAndFilterOptions();

    if (options.searchText && options.searchText !== defaultOptions.searchText) {
      queryParams.search = options.searchText;
    }

    if (options.tags && options.tags.length > 0 && options.tags.every((element, index) => element !== defaultOptions.tags[index])) {
      queryParams.tag = options.tags;
    }

    if (options.rating && options.rating > defaultOptions.rating || options.ratingOperator === RatingComparisonOperator.NoRating) {
      if (options.ratingOperator !== RatingComparisonOperator.NoRating) {
        queryParams.rating = options.rating;
      }
      queryParams.ratingOp = options.ratingOperator;
    }

    if (options.sortOptionOperator && options.sortOptionOperator !== defaultOptions.sortOptionOperator) {
      queryParams.sort = options.sortOptionOperator;
    }

    if (options.sortDirection && options.sortDirection !== defaultOptions.sortDirection) {
      queryParams.sortDir = options.sortDirection;
    }

    return queryParams;
  }

  public static getDefaultSortAndFilterOptions(): RitSortAndFilterOptions {
    return {
      searchText: '',
      tags: [],
      rating: 0,
      barcode: '',
      ratingOperator: RatingComparisonOperator.GreaterThanOrEqual,
      sortOptionOperator: SortOptionOperator.DateCreated,
      sortDirection: SortDirection.Descending,
    };
  }
}
