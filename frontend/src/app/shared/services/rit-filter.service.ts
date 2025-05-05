import { Injectable } from '@angular/core';
import { Rit } from '../../model/rit';

export enum RatingComparisonOperator {
  GreaterThanOrEqual = 'gte',
  LessThanOrEqual = 'lte',
  Equal = 'eq'
}

export interface RitFilterOptions {
  searchText: string;
  tags: string[];
  rating: number;
  ratingOperator: RatingComparisonOperator;
}

@Injectable({
  providedIn: 'root'
})
export class RitFilterService {

  constructor() { }


  public static filterRits(rits: Rit[], options: RitFilterOptions): Rit[] {
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

  public static getFilterOptionsFromUrl(params: any): RitFilterOptions {
    const options = this.getDefaultFilterOptions();
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

    return options;
  }

  public static buildQueryParams(options: RitFilterOptions): any {
    const queryParams: any = {};

    if (options.searchText) {
      queryParams.search = options.searchText;
    }

    if (options.tags?.length) {
      queryParams.tag = options.tags;
    }

    if (options.rating && options.rating > 0) {
      queryParams.rating = options.rating;
      queryParams.ratingOp = options.ratingOperator;
    }

    return queryParams;
  }

  public static getDefaultFilterOptions(): RitFilterOptions {
    return {
      searchText: '',
      tags: [],
      rating: 0,
      ratingOperator: RatingComparisonOperator.GreaterThanOrEqual
    };
  }
}
