import { EventEmitter, Injectable } from '@angular/core';
import {Params} from "@angular/router";

export type SelectedType = {
  beneficiary?: string,
  category?: string,
  country?: string,
  sortField?: string,
  term?: string,
};

const sortOptions = {
  amountRaised: 'Most raised',
  leastRaised: 'Least raised',
  matchFundsRemaining: 'Match funds remaining',
  closeToTarget: 'Close to campaign target',
  relevance: 'Relevance',
} as const;

type camelCaseSortOption = keyof typeof sortOptions;
type sortLabel = typeof sortOptions[camelCaseSortOption];

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  selected: {[key: string]: string|boolean} & {term?: string}; // SelectedType but allowing string key lookups.

  changed: EventEmitter<boolean>; // Value indicates if an interactive UI change triggered this.

  nonDefaultsActive: boolean;
  selectedSortLabel?: sortLabel;

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
  }, defaultSort: camelCaseSortOption) {
    this.nonDefaultsActive = true;
    this.selected['beneficiary'] = customSearchEvent.filterBeneficiary ? customSearchEvent.filterBeneficiary : '';
    this.selected['category'] = customSearchEvent.filterCategory ? customSearchEvent.filterCategory : '';
    this.selected['country'] = customSearchEvent.filterLocation ? customSearchEvent.filterLocation : '';

    const blankSearchText = (
      !customSearchEvent.searchText || customSearchEvent.searchText.trim() === ''
    );

    const previousSearchText = this.selected.term;
    // this helps for comparing the new search text with the previous, because 'null' and 'undefined' are changed to ''
    this.selected.term = blankSearchText ? '' : customSearchEvent.searchText;
    this.selected['sortField'] = SearchService.sortFieldToCamelCase(customSearchEvent.sortBy, defaultSort);

    this.updateSelectedSortLabel();

    if (this.selected.term !== previousSearchText) {
      if (blankSearchText) {
        // Reset everything
        this.reset(defaultSort, false);
      }

      // If search text changed and new search text is not blank, we want to re-sort by 'Relevance'. DON-558.
      this.selected['sortField'] = 'relevance';
    }

    this.changed.emit(true);
  }

  private static sortFieldToCamelCase(sortBy: string, defaultSort: camelCaseSortOption): camelCaseSortOption {
    let selected;

    // Not sure why TS isn't inferring `sortOptions`'s type any more; using `as` for now.
    (Object.keys(sortOptions) as camelCaseSortOption[]).forEach((key: camelCaseSortOption) => {
      if (sortBy === key || sortBy === sortOptions[key]) {
        selected = key;
    }});

    return selected ?? defaultSort;
  }

  private updateSelectedSortLabel() {
    switch(this.selected['sortField']) {
      case 'matchFundsRemaining':
        this.selectedSortLabel  = sortOptions.matchFundsRemaining;
        break;
      case 'amountRaised':
        this.selectedSortLabel =  sortOptions.amountRaised;
        break;
      case 'closeToTarget':
        this.selectedSortLabel =  sortOptions.closeToTarget;
        break;
      case 'leastRaised':
        this.selectedSortLabel =  sortOptions.leastRaised;
        break;
      case 'relevance':
      case 'Relevance': // historically we set this with a capital R.
        this.selectedSortLabel = sortOptions.relevance;
        break;
      default:
        console.log('No active sort field name match');
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
    const length = this.selected.term?.length || 0;

    for (const key in this.selected) {
      // Non-default selections should go to the page's query params. The "global default" sort
      // order should too iff there is a search term active, since the default sort in that
      // specific scenario is Relevance.
      if (this.selected[key] !== defaults[key] || (key === 'sortField' && length > 0)) {
        queryParams[key] = String(this.selected[key]);
      }
    }

    if (this.selected['sortField'] === 'relevance' && length === 0) {
      delete queryParams['sortField'];
    }

    return queryParams;
  }

  /**
   * Apply search state from a route.
   */
  loadQueryParams(queryParams: Params, defaultSort: string) {
    this.reset(defaultSort, true);

    if (Object.keys(queryParams).length > 0) {
      for (const key of Object.keys(queryParams)) {
        this.selected[key] = queryParams[key];

        if (key !== 'sortField' && this.selected[key]) {
          this.nonDefaultsActive = true;
        }
      }
    }

    this.updateSelectedSortLabel();

    this.changed.emit(false);
  }

  reset(defaultSort: string, skipChangeEvent: boolean) {
    this.nonDefaultsActive = false;
    this.selected = SearchService.selectedDefaults(defaultSort);

    if (!skipChangeEvent) {
      this.changed.emit(true);
    }
  }

  search(term: string, defaultSort: string) {
    this.nonDefaultsActive = true;
    this.selected.term = term;
    this.selected['sortField'] = term.length > 0 ? '' : defaultSort;
    this.changed.emit(true);
  }

  showClearFilters(): boolean {
    return Boolean(
      this.selected['beneficiary'] ||
      this.selected['category'] ||
      this.selected['country'] ||
      this.selected.term,
    );
  }

  sort(selectedSort: string) {
    this.selected['sortField'] = selectedSort;
    this.changed.emit(true);
  }
}
