import { EventEmitter, Injectable } from '@angular/core';

export type SelectedType = {
  beneficiary?: string,
  category?: string,
  country?: string,
  onlyMatching?: boolean,
  sortField?: string,
  term?: string,
};

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  selected: {[key: string]: any}; // SelectedType but allowing string key lookups.

  changed: EventEmitter<boolean>; // Value indicates if an interactive UI change triggered this.

  nonDefaultsActive: boolean;

  constructor() {
    this.changed = new EventEmitter();
    this.selected = SearchService.selectedDefaults();
    this.nonDefaultsActive = false;
  }

  static selectedDefaults(defaultSort = ''): SelectedType {
    return {
      beneficiary: '',
      category: '',
      country: '',
      onlyMatching: false,
      sortField: defaultSort,
      term: '',
    };
  }

  doSearchAndFilterAndSort(customSearchEvent: {
    searchText: string;
    sortBy: string;
    filterCategory: string;
    filterBeneficiary: string;
    filterLocation: string;
    filterFunding: string;
  }, defaultSort: string) {
    this.nonDefaultsActive = true;
    this.selected.beneficiary = customSearchEvent.filterBeneficiary ? customSearchEvent.filterBeneficiary : '';
    this.selected.category = customSearchEvent.filterCategory ? customSearchEvent.filterCategory : '';
    this.selected.country = customSearchEvent.filterLocation ? customSearchEvent.filterLocation : '';
    this.selected.onlyMatching = (customSearchEvent.filterFunding === 'Match Funded');

    const blankSearchText = (
      !customSearchEvent.searchText || customSearchEvent.searchText.trim() === ''
    );

    const previousSearchText = this.selected.term;
    // this helps for comparing the new search text with the previous, because 'null' and 'undefined' are changed to ''
    this.selected.term = blankSearchText ? '' : customSearchEvent.searchText;
    this.selected.sortField = customSearchEvent.sortBy ? customSearchEvent.sortBy : defaultSort;

    if (this.selected.term !== previousSearchText) {
      if (blankSearchText) {
        // Reset everything
        this.reset(defaultSort, false);
      }

      // If search text changed and new search text is not blank, we want to re-sort by 'Relevance'. DON-558.
      this.selected.sortField = 'Relevance';
    }

    this.changed.emit(true);
  }

  getSelectedSortLabel() {
    switch(this.selected.sortField) {
      case 'matchFundsRemaining':
        return 'Match funds remaining';
      case 'amountRaised':
        return 'Most raised';
      case 'Relevance':
        return 'Relevance';
      default:
        return null;
    }
  }

  filter(filterName: string, value: string|boolean) {
    this.nonDefaultsActive = true;
    this.selected[filterName] = value;
    this.changed.emit(true);
  }

  /**
   * Get just the params which should be in the query string as they diverge
   * from the defaults.
   */
  getQueryParams(defaultSort = ''): {[key: string]: string} {
    const defaults: {[key: string]: any} = SearchService.selectedDefaults(defaultSort);
    const queryParams: {[key: string]: any} = {};
    for (const key in this.selected) {
      if (this.selected[key] !== defaults[key]) {
        queryParams[key] = String(this.selected[key]);
      }
    }

    return queryParams;
  }

  hasTermFilterApplied(): boolean {
    return (this.getQueryParams().term?.length > 0);
  }

  /**
   * Apply search state from a route.
   *
   * @param routeParams object
   */
  loadQueryParams(queryParams: any, defaultSort: string) {
    this.reset(defaultSort, true);

    if (Object.keys(queryParams).length > 0) {
      for (const key of Object.keys(queryParams)) {
        if (key === 'onlyMatching') {
          // convert URL query param string to boolean
          this.selected[key] = (queryParams[key] === 'true');
        } else {
          this.selected[key] = queryParams[key];
        }

        if (key !== 'sortField' && this.selected[key]) {
          this.nonDefaultsActive = true;
        }
      }
    }

    this.changed.emit(false);
  }

  reset(defaultSort: string, skipChangeEvent: boolean) {
    this.nonDefaultsActive = false;
    this.selected = SearchService.selectedDefaults(defaultSort);

    if (!skipChangeEvent) {
      this.changed.emit(true);
    }
  }

  resetFilters() {
    const defaults = SearchService.selectedDefaults();
    this.selected.category = defaults.category;
    this.selected.beneficiary = defaults.beneficiary;
    this.selected.country = defaults.country;
    this.selected.onlyMatching = defaults.onlyMatching;
    this.changed.emit(true);
  }

  search(term: string, defaultSort: string) {
    this.nonDefaultsActive = true;
    this.selected.term = term;
    this.selected.sortField = term.length > 0 ? '' : defaultSort;
    this.changed.emit(true);
  }

  showClearFilters(): boolean {
    return Boolean(
      this.selected.beneficiary ||
      this.selected.category ||
      this.selected.country ||
      this.selected.onlyMatching ||
      this.selected.term,
    );
  }

  sort(selectedSort: string) {
    this.selected.sortField = selectedSort;
    this.changed.emit(true);
  }
}
