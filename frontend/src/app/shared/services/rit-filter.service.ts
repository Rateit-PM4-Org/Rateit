import { Injectable } from '@angular/core';
import { Rit } from '../../model/rit';

export enum RatingComparisonOperator {
  GreaterThanOrEqual = 'gte',
  LessThanOrEqual = 'lte',
  Equal = 'eq'
}

export enum SortOptionOperator {
  DateCreated = 'dateCreated',
  LastUpdated = 'lastUpdated',
  Rating = 'rating'
}

export enum SortDirection {
  Ascending = 'asc',
  Descending = 'desc'
}

export interface RitSortAndFilterOptions {
  searchText: string;
  tags: string[];
  rating: number;
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
    return rits.filter(rit => {
      const matchesSearch = !options.searchText ||
        rit.name?.toLowerCase().includes(options.searchText.toLowerCase());

      const matchesTags = !options.tags?.length ||
        options.tags.every(tag =>
          rit.tags?.some(ritTag => ritTag.toLowerCase() === tag.toLowerCase())
        );

      // Rating filter logic
      let matchesRating = true;
      if (options.rating && options.rating > 0) {
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

      return matchesSearch && matchesTags && matchesRating;
    });
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

    if (options.rating && options.rating > defaultOptions.rating) {
      queryParams.rating = options.rating;
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
      ratingOperator: RatingComparisonOperator.GreaterThanOrEqual,
      sortOptionOperator: SortOptionOperator.DateCreated,
      sortDirection: SortDirection.Descending,
    };
  }
}
