import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { FiltersSelectDialogComponent } from './filters-select-dialog.component';
import { SearchService } from '../search.service';

enum FilterEnum {
  'beneficiary',
  'category',
  'country',
  'onlyMatching',
  'term',
}

export type FilterType = keyof typeof FilterEnum;

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent {
  @Input() getDefaultSort: () => string;

  constructor(public dialog: MatDialog, public search: SearchService) {}

  openFilters() {
    this.dialog.open(FiltersSelectDialogComponent);
  }

  clearFilters() {
    this.search.reset(this.getDefaultSort());
  }

  hasFilter(): boolean {
    return Boolean(
      this.search.selected.beneficiary ||
      this.search.selected.category ||
      this.search.selected.country ||
      this.search.selected.onlyMatching,
    );
  }

  hasTerm(): boolean {
    return (this.search.selected.term || '').length > 0;
  }
}
