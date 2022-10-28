import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

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
    MatButtonModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,
  ],
})
export class FiltersComponent {
  @Input() getDefaultSort: () => string;

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
