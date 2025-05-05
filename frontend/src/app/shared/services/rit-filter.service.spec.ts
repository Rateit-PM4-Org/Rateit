import { TestBed } from '@angular/core/testing';

import { RatingComparisonOperator, RitSortAndFilterOptions, RitFilterService, SortOptionOperator, SortDirection } from './rit-filter.service';
import { Rit } from '../../model/rit';

describe('RitFilterService', () => {
  let service: RitFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RitFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should filter rits based on search text', () => {
    const rits: Rit[] = [
      { id: '1', name: 'Test Rit 1', details: 'Details 1', tags: ['tag1'], codes: ['code1'] },
      { id: '2', name: 'Another Rit', details: 'Details 2', tags: ['tag2'], codes: ['code2'] }
    ];
    const options: RitSortAndFilterOptions = {
      searchText: 'Test',
      tags: [],
      rating: 0,
      ratingOperator: RatingComparisonOperator.GreaterThanOrEqual,
      sortOptionOperator: SortOptionOperator.DateCreated,
      sortDirection: SortDirection.Descending,
    };

    const filteredRits = RitFilterService.filterRits(rits, options);

    expect(filteredRits.length).toBe(1);
    expect(filteredRits[0].name).toBe('Test Rit 1');
  });

  it('should filter rits based on selected tag', () => {
    const rits: Rit[] = [
      { id: '1', name: 'Test Rit 1', details: 'Details 1', tags: ['tag1', 'common'], codes: ['code1'] },
      { id: '2', name: 'Test Rit 2', details: 'Details 2', tags: ['tag2', 'common'], codes: ['code2'] }
    ];
    const options: RitSortAndFilterOptions = {
      searchText: '',
      tags: ['tag1'],
      rating: 0,
      ratingOperator: RatingComparisonOperator.GreaterThanOrEqual,
      sortOptionOperator: SortOptionOperator.DateCreated,
      sortDirection: SortDirection.Descending,
    };

    const filteredRits = RitFilterService.filterRits(rits, options);

    expect(filteredRits.length).toBe(1);
    expect(filteredRits[0].name).toBe('Test Rit 1');
  });

  it('should filter rits based on both search text and tag', () => {
    const rits: Rit[] = [
      { id: '1', name: 'Test Rit 1', details: 'Details 1', tags: ['tag1'], codes: ['code1'] },
      { id: '2', name: 'Test Rit 2', details: 'Details 2', tags: ['tag2'], codes: ['code2'] },
      { id: '3', name: 'Another Rit', details: 'Details 3', tags: ['tag1'], codes: ['code3'] }
    ];
    const options: RitSortAndFilterOptions = {
      searchText: 'Test',
      tags: ['tag1'],
      rating: 0,
      ratingOperator: RatingComparisonOperator.GreaterThanOrEqual,
      sortOptionOperator: SortOptionOperator.DateCreated,
      sortDirection: SortDirection.Descending,
    };

    const filteredRits = RitFilterService.filterRits(rits, options);

    expect(filteredRits.length).toBe(1);
    expect(filteredRits[0].name).toBe('Test Rit 1');
  });

  it('should filter rits that match all selected tags', () => {
    const rits: Rit[] = [
      {
        id: '1', name: 'Rit 1', details: 'Details 1', tags: ['tag1', 'tag2', 'tag3'],
        codes: []
      },
      {
        id: '2', name: 'Rit 2', details: 'Details 2', tags: ['tag1', 'tag3'],
        codes: []
      },
      {
        id: '3', name: 'Rit 3', details: 'Details 3', tags: ['tag2', 'tag3'],
        codes: []
      }
    ];
    const options: RitSortAndFilterOptions = {
      searchText: '',
      tags: ['tag1', 'tag3'],
      rating: 0,
      ratingOperator: RatingComparisonOperator.GreaterThanOrEqual,
      sortOptionOperator: SortOptionOperator.DateCreated,
      sortDirection: SortDirection.Descending,
    };

    const filteredRits = RitFilterService.filterRits(rits, options);

    expect(filteredRits.length).toBe(2);
    expect(filteredRits[0].id).toBe('1');
    expect(filteredRits[1].id).toBe('2');
  });

  it('should filter rits by rating with Greater Than Or Equal operator', () => {
    const rits: Rit[] = [
      {
        id: '1', name: 'Rit 1', details: 'Details 1', tags: [], codes: [],
        ratings: [{ value: 4, createdAt: '2023-01-01' }]
      },
      {
        id: '2', name: 'Rit 2', details: 'Details 2', tags: [], codes: [],
        ratings: [{ value: 3, createdAt: '2023-01-01' }]
      },
      {
        id: '3', name: 'Rit 3', details: 'Details 3', tags: [], codes: [],
        ratings: [{ value: 2, createdAt: '2023-01-01' }]
      }
    ];
    const options: RitSortAndFilterOptions = {
      searchText: '',
      tags: [],
      rating: 3,
      ratingOperator: RatingComparisonOperator.GreaterThanOrEqual,
      sortOptionOperator: SortOptionOperator.DateCreated,
      sortDirection: SortDirection.Descending,
    };

    const filteredRits = RitFilterService.filterRits(rits, options);

    expect(filteredRits.length).toBe(2);
    expect(filteredRits[0].id).toBe('1');
    expect(filteredRits[1].id).toBe('2');
  });

  it('should filter rits by rating with Equal operator', () => {
    const rits: Rit[] = [
      {
        id: '1', name: 'Rit 1', details: 'Details 1', tags: [], codes: [],
        ratings: [{ value: 4, createdAt: '2023-01-01' }]
      },
      {
        id: '2', name: 'Rit 2', details: 'Details 2', tags: [], codes: [],
        ratings: [{ value: 3, createdAt: '2023-01-01' }]
      },
      {
        id: '3', name: 'Rit 3', details: 'Details 3', tags: [], codes: [],
        ratings: [{ value: 3, createdAt: '2023-01-01' }]
      }
    ];
    const options: RitSortAndFilterOptions = {
      searchText: '',
      tags: [],
      rating: 3,
      ratingOperator: RatingComparisonOperator.Equal,
      sortOptionOperator: SortOptionOperator.DateCreated,
      sortDirection: SortDirection.Descending,
    };

    const filteredRits = RitFilterService.filterRits(rits, options);

    expect(filteredRits.length).toBe(2);
    expect(filteredRits[0].id).toBe('2');
    expect(filteredRits[1].id).toBe('3');
  });

  it('should filter rits by rating with Less Than Or Equal operator', () => {
    const rits: Rit[] = [
      {
        id: '1', name: 'Rit 1', details: 'Details 1', tags: [], codes: [],
        ratings: [{ value: 4, createdAt: '2023-01-01' }]
      },
      {
        id: '2', name: 'Rit 2', details: 'Details 2', tags: [], codes: [],
        ratings: [{ value: 3, createdAt: '2023-01-01' }]
      },
      {
        id: '3', name: 'Rit 3', details: 'Details 3', tags: [], codes: [],
        ratings: [{ value: 2, createdAt: '2023-01-01' }]
      }
    ];
    const options: RitSortAndFilterOptions = {
      searchText: '',
      tags: [],
      rating: 3,
      ratingOperator: RatingComparisonOperator.LessThanOrEqual,
      sortOptionOperator: SortOptionOperator.DateCreated,
      sortDirection: SortDirection.Descending,
    };

    const filteredRits = RitFilterService.filterRits(rits, options);

    expect(filteredRits.length).toBe(2);
    expect(filteredRits[0].id).toBe('2');
    expect(filteredRits[1].id).toBe('3');
  });

  it('should filter by the latest rating when multiple ratings exist', () => {
    const rits: Rit[] = [
      {
        id: '1', name: 'Rit 1', details: 'Details 1', tags: [], codes: [],
        ratings: [
          { value: 2, createdAt: '2023-01-01' },
          { value: 5, createdAt: '2023-03-01' }, // Latest should be used
          { value: 3, createdAt: '2023-02-01' }
        ]
      },
      {
        id: '2', name: 'Rit 2', details: 'Details 2', tags: [], codes: [],
        ratings: [{ value: 3, createdAt: '2023-01-01' }]
      }
    ];
    const options: RitSortAndFilterOptions = {
      searchText: '',
      tags: [],
      rating: 4,
      ratingOperator: RatingComparisonOperator.GreaterThanOrEqual,
      sortOptionOperator: SortOptionOperator.DateCreated,
      sortDirection: SortDirection.Descending,
    };

    const filteredRits = RitFilterService.filterRits(rits, options);

    expect(filteredRits.length).toBe(1);
    expect(filteredRits[0].id).toBe('1');
  });

  it('should handle rits with no ratings when filtering by rating', () => {
    const rits: Rit[] = [
      {
        id: '1', name: 'Rit 1', details: 'Details 1', tags: [], codes: [],
        ratings: [{ value: 4, createdAt: '2023-01-01' }]
      },
      {
        id: '2', name: 'Rit 2', details: 'Details 2', tags: [], codes: [],
        ratings: []
      },
      {
        id: '3', name: 'Rit 3', details: 'Details 3', tags: [], codes: []
      }
    ];
    const options: RitSortAndFilterOptions = {
      searchText: '',
      tags: [],
      rating: 1,
      ratingOperator: RatingComparisonOperator.GreaterThanOrEqual,
      sortOptionOperator: SortOptionOperator.DateCreated,
      sortDirection: SortDirection.Descending,
    };

    const filteredRits = RitFilterService.filterRits(rits, options);

    expect(filteredRits.length).toBe(1);
    expect(filteredRits[0].id).toBe('1');
  });

  it('should handle combined filtering with search, tags and rating', () => {
    const rits: Rit[] = [
      {
        id: '1', name: 'Test Rit', details: 'Details 1',
        tags: ['tag1', 'tag2'], codes: [],
        ratings: [{ value: 4, createdAt: '2023-01-01' }]
      },
      {
        id: '2', name: 'Test Rit 2', details: 'Details 2',
        tags: ['tag1'], codes: [],
        ratings: [{ value: 2, createdAt: '2023-01-01' }]
      },
      {
        id: '3', name: 'Another Rit', details: 'Details 3',
        tags: ['tag1', 'tag2'], codes: [],
        ratings: [{ value: 5, createdAt: '2023-01-01' }]
      }
    ];

    const options: RitSortAndFilterOptions = {
      searchText: 'Test',
      tags: ['tag1'],
      rating: 3,
      ratingOperator: RatingComparisonOperator.GreaterThanOrEqual,
      sortOptionOperator: SortOptionOperator.DateCreated,
      sortDirection: SortDirection.Descending,
    };

    const filteredRits = RitFilterService.filterRits(rits, options);

    expect(filteredRits.length).toBe(1);
    expect(filteredRits[0].id).toBe('1');
  });
});

describe('getFilterOptionsFromUrl', () => {
  it('should return default options when params are null', () => {
    const options = RitFilterService.getFilterOptionsFromUrl(null);
    expect(options).toEqual({
      searchText: '',
      tags: [],
      rating: 0,
      ratingOperator: RatingComparisonOperator.GreaterThanOrEqual,
      sortOptionOperator: SortOptionOperator.DateCreated,
      sortDirection: SortDirection.Descending
    });
  });

  it('should extract search text from query params', () => {
    const params = { search: 'test query' };
    const options = RitFilterService.getFilterOptionsFromUrl(params);

    expect(options.searchText).toBe('test query');
  });

  it('should extract a single tag from query params', () => {
    const params = { tag: 'singleTag' };
    const options = RitFilterService.getFilterOptionsFromUrl(params);

    expect(options.tags).toEqual(['singleTag']);
  });

  it('should extract multiple tags from query params', () => {
    const params = { tag: ['tag1', 'tag2'] };
    const options = RitFilterService.getFilterOptionsFromUrl(params);

    expect(options.tags).toEqual(['tag1', 'tag2']);
  });

  it('should extract rating value from query params', () => {
    const params = { rating: '4' };
    const options = RitFilterService.getFilterOptionsFromUrl(params);

    expect(options.rating).toBe(4);
  });

  it('should extract rating operator from query params', () => {
    const params = {
      rating: '3',
      ratingOp: RatingComparisonOperator.Equal
    };
    const options = RitFilterService.getFilterOptionsFromUrl(params);

    expect(options.rating).toBe(3);
    expect(options.ratingOperator).toBe(RatingComparisonOperator.Equal);
  });

  it('should extract all filter options from query params', () => {
    const params = {
      search: 'test query',
      tag: ['tag1', 'tag2'],
      rating: '5',
      ratingOp: RatingComparisonOperator.LessThanOrEqual
    };

    const options = RitFilterService.getFilterOptionsFromUrl(params);

    expect(options).toEqual({
      searchText: 'test query',
      tags: ['tag1', 'tag2'],
      rating: 5,
      ratingOperator: RatingComparisonOperator.LessThanOrEqual,
      sortOptionOperator: SortOptionOperator.DateCreated,
      sortDirection: SortDirection.Descending
    });
  });
});

describe('buildQueryParams', () => {
  it('should build empty query params object when no filters are set', () => {
    const options = RitFilterService.getDefaultSortAndFilterOptions();
    const params = RitFilterService.buildQueryParams(options);

    expect(params).toEqual({});
  });

  it('should include search text in query params when set', () => {
    const options = {
      searchText: 'test query',
      tags: [],
      rating: 0,
      ratingOperator: RatingComparisonOperator.GreaterThanOrEqual,
      sortOptionOperator: SortOptionOperator.DateCreated,
      sortDirection: SortDirection.Descending,
    };

    const params = RitFilterService.buildQueryParams(options);

    expect(params).toEqual({ search: 'test query' });
  });

  it('should include tags in query params when set', () => {
    const options = {
      searchText: '',
      tags: ['tag1', 'tag2'],
      rating: 0,
      ratingOperator: RatingComparisonOperator.GreaterThanOrEqual,
      sortOptionOperator: SortOptionOperator.DateCreated,
      sortDirection: SortDirection.Descending,
    };

    const params = RitFilterService.buildQueryParams(options);

    expect(params).toEqual({ tag: ['tag1', 'tag2'] });
  });

  it('should include rating and operator in query params when rating is set', () => {
    const options = {
      searchText: '',
      tags: [],
      rating: 4,
      ratingOperator: RatingComparisonOperator.Equal,
      sortOptionOperator: SortOptionOperator.DateCreated,
      sortDirection: SortDirection.Descending,
    };

    const params = RitFilterService.buildQueryParams(options);

    expect(params).toEqual({
      rating: 4,
      ratingOp: RatingComparisonOperator.Equal
    });
  });

  it('should include all filter options in query params when all are set', () => {
    const options = {
      searchText: 'test query',
      tags: ['tag1', 'tag2'],
      rating: 5,
      ratingOperator: RatingComparisonOperator.LessThanOrEqual,
      sortOptionOperator: SortOptionOperator.DateCreated,
      sortDirection: SortDirection.Descending,
    };

    const params = RitFilterService.buildQueryParams(options);

    expect(params).toEqual({
      search: 'test query',
      tag: ['tag1', 'tag2'],
      rating: 5,
      ratingOp: RatingComparisonOperator.LessThanOrEqual
    });
  });
});

describe('getDefaultFilterOptions', () => {
  it('should return the default filter options', () => {
    const options = RitFilterService.getDefaultSortAndFilterOptions();

    expect(options).toEqual({
      searchText: '',
      tags: [],
      rating: 0,
      ratingOperator: RatingComparisonOperator.GreaterThanOrEqual,
      sortOptionOperator: SortOptionOperator.DateCreated,
      sortDirection: SortDirection.Descending,
    });
  });
});

describe('RitFilterService - Sorting Tests', () => {
  it('should sort rits by date created in descending order', () => {
    const rits: Rit[] = [
      {
        id: '1',
        name: 'Rit 1',
        details: 'Details 1',
        tags: [],
        codes: [],
        createdAt: '2023-01-01T10:00:00Z'
      },
      {
        id: '2',
        name: 'Rit 2',
        details: 'Details 2',
        tags: [],
        codes: [],
        createdAt: '2023-03-01T10:00:00Z'
      },
      {
        id: '3',
        name: 'Rit 3',
        details: 'Details 3',
        tags: [],
        codes: [],
        createdAt: '2023-02-01T10:00:00Z'
      }
    ];

    const options: RitSortAndFilterOptions = {
      searchText: '',
      tags: [],
      rating: 0,
      ratingOperator: RatingComparisonOperator.GreaterThanOrEqual,
      sortOptionOperator: SortOptionOperator.DateCreated,
      sortDirection: SortDirection.Descending,
    };

    const sortedRits = RitFilterService.filterRits(rits, options);

    expect(sortedRits.length).toBe(3);
    expect(sortedRits[0].id).toBe('2'); // Newest
    expect(sortedRits[1].id).toBe('3');
    expect(sortedRits[2].id).toBe('1'); // Oldest
  });

  it('should sort rits by date created in ascending order', () => {
    const rits: Rit[] = [
      {
        id: '1',
        name: 'Rit 1',
        details: 'Details 1',
        tags: [],
        codes: [],
        createdAt: '2023-01-01T10:00:00Z'
      },
      {
        id: '2',
        name: 'Rit 2',
        details: 'Details 2',
        tags: [],
        codes: [],
        createdAt: '2023-03-01T10:00:00Z'
      },
      {
        id: '3',
        name: 'Rit 3',
        details: 'Details 3',
        tags: [],
        codes: [],
        createdAt: '2023-02-01T10:00:00Z'
      }
    ];

    const options: RitSortAndFilterOptions = {
      searchText: '',
      tags: [],
      rating: 0,
      ratingOperator: RatingComparisonOperator.GreaterThanOrEqual,
      sortOptionOperator: SortOptionOperator.DateCreated,
      sortDirection: SortDirection.Ascending,
    };

    const sortedRits = RitFilterService.filterRits(rits, options);

    expect(sortedRits.length).toBe(3);
    expect(sortedRits[0].id).toBe('1'); // Oldest
    expect(sortedRits[1].id).toBe('3');
    expect(sortedRits[2].id).toBe('2'); // Newest
  });

  it('should sort rits by last updated in descending order', () => {
    const rits: Rit[] = [
      {
        id: '1',
        name: 'Rit 1',
        details: 'Details 1',
        tags: [],
        codes: [],
        updatedAt: '2023-01-01T10:00:00Z'
      },
      {
        id: '2',
        name: 'Rit 2',
        details: 'Details 2',
        tags: [],
        codes: [],
        updatedAt: '2023-03-01T10:00:00Z'
      },
      {
        id: '3',
        name: 'Rit 3',
        details: 'Details 3',
        tags: [],
        codes: [],
        updatedAt: '2023-02-01T10:00:00Z'
      }
    ];

    const options: RitSortAndFilterOptions = {
      searchText: '',
      tags: [],
      rating: 0,
      ratingOperator: RatingComparisonOperator.GreaterThanOrEqual,
      sortOptionOperator: SortOptionOperator.LastUpdated,
      sortDirection: SortDirection.Descending,
    };

    const sortedRits = RitFilterService.filterRits(rits, options);

    expect(sortedRits.length).toBe(3);
    expect(sortedRits[0].id).toBe('2'); // Most recently updated
    expect(sortedRits[1].id).toBe('3');
    expect(sortedRits[2].id).toBe('1'); // Least recently updated
  });

  it('should sort rits by last updated in ascending order', () => {
    const rits: Rit[] = [
      {
        id: '1',
        name: 'Rit 1',
        details: 'Details 1',
        tags: [],
        codes: [],
        updatedAt: '2023-01-01T10:00:00Z'
      },
      {
        id: '2',
        name: 'Rit 2',
        details: 'Details 2',
        tags: [],
        codes: [],
        updatedAt: '2023-03-01T10:00:00Z'
      },
      {
        id: '3',
        name: 'Rit 3',
        details: 'Details 3',
        tags: [],
        codes: [],
        updatedAt: '2023-02-01T10:00:00Z'
      }
    ];

    const options: RitSortAndFilterOptions = {
      searchText: '',
      tags: [],
      rating: 0,
      ratingOperator: RatingComparisonOperator.GreaterThanOrEqual,
      sortOptionOperator: SortOptionOperator.LastUpdated,
      sortDirection: SortDirection.Ascending,
    };

    const sortedRits = RitFilterService.filterRits(rits, options);

    expect(sortedRits.length).toBe(3);
    expect(sortedRits[0].id).toBe('1'); // Least recently updated
    expect(sortedRits[1].id).toBe('3');
    expect(sortedRits[2].id).toBe('2'); // Most recently updated
  });

  it('should sort rits by rating in descending order', () => {
    const rits: Rit[] = [
      {
        id: '1',
        name: 'Rit 1',
        details: 'Details 1',
        tags: [],
        codes: [],
        ratings: [{ value: 3, createdAt: '2023-01-01' }]
      },
      {
        id: '2',
        name: 'Rit 2',
        details: 'Details 2',
        tags: [],
        codes: [],
        ratings: [{ value: 5, createdAt: '2023-01-01' }]
      },
      {
        id: '3',
        name: 'Rit 3',
        details: 'Details 3',
        tags: [],
        codes: [],
        ratings: [{ value: 4, createdAt: '2023-01-01' }]
      }
    ];

    const options: RitSortAndFilterOptions = {
      searchText: '',
      tags: [],
      rating: 0,
      ratingOperator: RatingComparisonOperator.GreaterThanOrEqual,
      sortOptionOperator: SortOptionOperator.Rating,
      sortDirection: SortDirection.Descending,
    };

    const sortedRits = RitFilterService.filterRits(rits, options);

    expect(sortedRits.length).toBe(3);
    expect(sortedRits[0].id).toBe('2'); // Highest rating
    expect(sortedRits[1].id).toBe('3');
    expect(sortedRits[2].id).toBe('1'); // Lowest rating
  });

  it('should sort rits by rating in ascending order', () => {
    const rits: Rit[] = [
      {
        id: '1',
        name: 'Rit 1',
        details: 'Details 1',
        tags: [],
        codes: [],
        ratings: [{ value: 3, createdAt: '2023-01-01' }]
      },
      {
        id: '2',
        name: 'Rit 2',
        details: 'Details 2',
        tags: [],
        codes: [],
        ratings: [{ value: 5, createdAt: '2023-01-01' }]
      },
      {
        id: '3',
        name: 'Rit 3',
        details: 'Details 3',
        tags: [],
        codes: [],
        ratings: [{ value: 4, createdAt: '2023-01-01' }]
      }
    ];

    const options: RitSortAndFilterOptions = {
      searchText: '',
      tags: [],
      rating: 0,
      ratingOperator: RatingComparisonOperator.GreaterThanOrEqual,
      sortOptionOperator: SortOptionOperator.Rating,
      sortDirection: SortDirection.Ascending,
    };

    const sortedRits = RitFilterService.filterRits(rits, options);

    expect(sortedRits.length).toBe(3);
    expect(sortedRits[0].id).toBe('1'); // Lowest rating
    expect(sortedRits[1].id).toBe('3');
    expect(sortedRits[2].id).toBe('2'); // Highest rating
  });

  it('should handle rits with mixed ratings and sort them correctly', () => {
    const rits: Rit[] = [
      {
        id: '1',
        name: 'Rit 1',
        details: 'Details 1',
        tags: [],
        codes: [],
        ratings: [
          { value: 2, createdAt: '2023-01-01' },
          { value: 4, createdAt: '2023-03-01' } // Latest should be used
        ]
      },
      {
        id: '2',
        name: 'Rit 2',
        details: 'Details 2',
        tags: [],
        codes: [],
        ratings: [{ value: 5, createdAt: '2023-01-01' }]
      },
      {
        id: '3',
        name: 'Rit 3',
        details: 'Details 3',
        tags: [],
        codes: [] // No ratings
      }
    ];

    const options: RitSortAndFilterOptions = {
      searchText: '',
      tags: [],
      rating: 0,
      ratingOperator: RatingComparisonOperator.GreaterThanOrEqual,
      sortOptionOperator: SortOptionOperator.Rating,
      sortDirection: SortDirection.Descending,
    };

    const sortedRits = RitFilterService.filterRits(rits, options);

    expect(sortedRits.length).toBe(3);
    expect(sortedRits[0].id).toBe('2'); // Rating 5
    expect(sortedRits[1].id).toBe('1'); // Latest rating 4
    expect(sortedRits[2].id).toBe('3'); // No rating (0)
  });

  it('should handle filtering and sorting together', () => {
    const rits: Rit[] = [
      {
        id: '1',
        name: 'Test Rit 1',
        details: 'Details 1',
        tags: ['tag1'],
        codes: [],
        ratings: [{ value: 3, createdAt: '2023-01-01' }],
        createdAt: '2023-01-15T10:00:00Z'
      },
      {
        id: '2',
        name: 'Test Rit 2',
        details: 'Details 2',
        tags: ['tag2'],
        codes: [],
        ratings: [{ value: 5, createdAt: '2023-01-01' }],
        createdAt: '2023-01-10T10:00:00Z'
      },
      {
        id: '3',
        name: 'Another Rit',
        details: 'Details 3',
        tags: ['tag1'],
        codes: [],
        ratings: [{ value: 4, createdAt: '2023-01-01' }],
        createdAt: '2023-01-20T10:00:00Z'
      }
    ];

    const options: RitSortAndFilterOptions = {
      searchText: 'Test',
      tags: [],
      rating: 0,
      ratingOperator: RatingComparisonOperator.GreaterThanOrEqual,
      sortOptionOperator: SortOptionOperator.DateCreated,
      sortDirection: SortDirection.Ascending,
    };

    const filteredAndSortedRits = RitFilterService.filterRits(rits, options);

    expect(filteredAndSortedRits.length).toBe(2);
    expect(filteredAndSortedRits[0].id).toBe('2'); // Older creation date
    expect(filteredAndSortedRits[1].id).toBe('1'); // Newer creation date
  });



  it('should calculate lastInteractionAt correctly - rating newer', () => {
    const ritMock = {
      updatedAt: '2023-01-01T00:00:00Z',
      ratings: [{ createdAt: '2023-01-01T00:00:01Z' }]
    } as Rit;

    const result = RitFilterService.calculateLastInteractionAt(ritMock);

    expect(result.toISOString()).toBe('2023-01-01T00:00:01.000Z');
  });

  it('should calculate lastInteractionAt correctly - multiple ratings', () => {
    const ritMock = {
      updatedAt: '2023-01-01T00:00:00Z',
      ratings: [{ createdAt: '2023-01-01T00:00:01Z' }, { createdAt: '2023-01-02T00:00:01Z' }]
    } as Rit;

    const result = RitFilterService.calculateLastInteractionAt(ritMock);

    expect(result.toISOString()).toBe('2023-01-02T00:00:01.000Z');
  });

  it('should calculate lastInteractionAt correctly - ratings without date', () => {
    const ritMock = {
      updatedAt: '2023-01-01T00:00:00Z',
      ratings: [{}, {}]
    } as Rit;

    const result = RitFilterService.calculateLastInteractionAt(ritMock);

    expect(result.toISOString()).toBe('2023-01-01T00:00:00.000Z');
  });

  it('should calculate lastInteractionAt correctly - updatedAt newer', () => {
    const ritMock = {
      updatedAt: '2023-01-01T00:00:02Z',
      ratings: [{ createdAt: '2023-01-01T00:00:01Z' }]
    } as Rit;

    const result = RitFilterService.calculateLastInteractionAt(ritMock);

    expect(result.toISOString()).toBe('2023-01-01T00:00:02.000Z');
  });

  it('should calculate lastInteractionAt correctly - no ratings', () => {
    const ritMock = {
      updatedAt: '2023-01-01T00:00:00Z',
    } as Rit;

    const result = RitFilterService.calculateLastInteractionAt(ritMock);

    expect(result.toISOString()).toBe('2023-01-01T00:00:00.000Z');
  });
  it('should calculate lastInteractionAt correctly - no updatedAt', () => {
    const ritMock = {
      updatedAt: undefined,
      ratings: [{ createdAt: '2023-01-01T00:00:01Z' }]
    } as Rit;

    const result = RitFilterService.calculateLastInteractionAt(ritMock);

    expect(result.toISOString()).toBe('2023-01-01T00:00:01.000Z');
  });

  it('should calculate lastInteractionAt correctly - no ratings and updatedAt', () => {
    const ritMock = {
      updatedAt: undefined,
    } as Rit;

    const result = RitFilterService.calculateLastInteractionAt(ritMock);

    expect(result.toISOString()).toBe('1970-01-01T00:00:00.000Z');
  });

});
