import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleCheck, faFilter, faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons';

import { allChildComponentImports } from '../../allChildComponentImports';
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
  standalone: true,
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
  imports: [
    ...allChildComponentImports,
    FontAwesomeModule,
    MatButtonModule,
    MatDialogModule,
    MatOptionModule,
    MatSelectModule,
  ],
})
export class FiltersComponent {
  @Input() getDefaultSort: () => string;
  faCircleCheck = faCircleCheck;
  faFilter = faFilter;
  faFilterCircleXmark = faFilterCircleXmark;

  constructor(public dialog: MatDialog, public search: SearchService) {}

  openFilters() {
    this.dialog.open(FiltersSelectDialogComponent);
  }

  clearFilters() {
    this.search.reset(this.getDefaultSort(), false);
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
