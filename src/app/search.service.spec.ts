import { TestBed } from '@angular/core/testing';

import { SearchService } from './search.service';

describe('SearchService', () => {
  let service: SearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update selectedSortLabel and emit changed event when sort is called', (done) => {
    service.changed.subscribe((interactive) => {
      expect(interactive).toBeTrue();
      expect(service.selected['sortField']).toBe('location');
      expect(service.selectedSortLabel).toBe('Closest');
      done();
    });

    service.sort('location');
  });

  it('should include location query parameters when geolocation is provided', () => {
    service.sort('location');
    const dummyPosition = {
      coords: { latitude: 51.5, longitude: -0.1 },
    } as GeolocationPosition;

    const queryParams = service.getQueryParams('matchFundsRemaining', dummyPosition);
    expect(queryParams['sortField']).toBe('location');
    expect(queryParams['filterByLatLong']).toBe('true');
    expect(queryParams['r']).toBeDefined();
  });

  it('should update selectedSortLabel when loading query params with location sort', () => {
    service.loadQueryParams({ sortField: 'location', filterByLatLong: 'true' }, 'matchFundsRemaining');
    expect(service.selected['sortField']).toBe('location');
    expect(service.selectedSortLabel).toBe('Closest');
    expect(service.hasGeoLocationSet()).toBeTrue();
  });

  it('should clear theme and category query params when filterTheme is cleared', () => {
    service.doSearchAndFilterAndSort(
      {
        searchText: null,
        sortBy: null,
        filterTheme: 'Religious',
        filterLocation: null,
      },
      'matchFundsRemaining',
    );

    let queryParams = service.getQueryParams('matchFundsRemaining', undefined);
    expect(queryParams['category']).toBe('Religious');
    expect(queryParams['theme']).toBe('Religious');

    service.doSearchAndFilterAndSort(
      {
        searchText: null,
        sortBy: null,
        filterTheme: null,
        filterLocation: null,
      },
      'matchFundsRemaining',
    );

    queryParams = service.getQueryParams('matchFundsRemaining', undefined);
    expect(queryParams['category']).toBeUndefined();
    expect(queryParams['theme']).toBeUndefined();
  });
});
