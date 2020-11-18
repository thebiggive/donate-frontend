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

  constructor() {
    this.changed = new EventEmitter();
    this.selected = SearchService.selectedDefaults();
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

  filter(filterName: string, value: string) {
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

  /**
   * Apply search state from a route.
   *
   * @param routeParams object
   */
  loadQueryParams(queryParams: any, defaultSort: string) {
    this.reset(defaultSort);

    if (Object.keys(queryParams).length > 0) {
      for (const key of Object.keys(queryParams)) {
        if (key === 'onlyMatching') {
          // convert URL query param string to boolean
          this.selected[key] = (queryParams[key] === 'true');
        } else {
          this.selected[key] = queryParams[key];
        }
      }
    }

    this.changed.emit(false);
  }

  reset(defaultSort: string) {
    this.selected = SearchService.selectedDefaults(defaultSort);
    this.changed.emit(true);
  }

  search(term: string, defaultSort: string) {
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
