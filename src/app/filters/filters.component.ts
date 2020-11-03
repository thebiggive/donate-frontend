import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';

import { FiltersSelectDialogComponent } from './filters-select-dialog.component';

enum FilterEnum {
  'beneficiary',
  'category',
  'country',
  'onlyMatching',
  'term',
}

export type FilterType = keyof typeof FilterEnum;

export type SelectedType = {
  beneficiary?: string,
  category?: string,
  country?: string,
  onlyMatching?: boolean,
  sortField?: string,
  term?: string,
};

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent implements OnInit, OnDestroy {
  @Input() defaultNonRelevanceSort: 'amountRaised' | 'matchFundsRemaining';
  @Input() reset: Observable<void>;
  @Input() @Output() selected: SelectedType;
  @Input() showClearFilters: boolean;
  @Output() filterApplied: EventEmitter<any> = new EventEmitter();
  @Output() sortApplied: EventEmitter<any> = new EventEmitter();
  @Output() clearFiltersApplied: EventEmitter<any> = new EventEmitter();

  private resetSubscription: Subscription;

  constructor(public dialog: MatDialog) {}

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

  /**
   * Get just the params which should be in the query string as they diverge
   * from the defaults.
   */
  static getQueryParams(selected: {[key: string]: any}, defaultSort = ''): {[key: string]: string} {
    const defaults: {[key: string]: any} = FiltersComponent.selectedDefaults(defaultSort);
    const queryParams: {[key: string]: any} = {};
    for (const key in selected) {
      if (selected[key] !== defaults[key]) {
        queryParams[key] = String(selected[key]);
      }
    }

    return queryParams;
  }

  ngOnInit() {
    this.resetSubscription = this.reset.subscribe(() => {
      this.selected.sortField = this.defaultSort();
    });
  }

  ngOnDestroy() {
    this.resetSubscription.unsubscribe();
  }

  openFilters() {
    const fsdInstance = this.dialog.open(FiltersSelectDialogComponent).componentInstance;
    fsdInstance.filterApplied = this.filterApplied;
    fsdInstance.reset = this.reset;
    fsdInstance.selected = this.selected;
    fsdInstance.setFilter = this.setFilter;
  }

  setFilter(filterName: FilterType, event: { value: string }) {
    this.filterApplied.emit({filterName, value: event.value});

    if (filterName === 'term' && event.value.length > 0) {
      this.setSortField({ value: '' });
    }
  }

  setSortField(event: { value: string }) {
    this.sortApplied.emit(event.value);
  }

  clearFilters() {
    this.clearFiltersApplied.emit();
  }

  defaultSort(): string {
    return (this.hasTerm() ? '' : this.defaultNonRelevanceSort);
  }

  hasTerm(): boolean {
    return (this.selected.term || '').length > 0;
  }
}
