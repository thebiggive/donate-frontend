import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/free-brands-svg-icons';

import { CampaignGroupsService } from '../campaign-groups.service';
import { SearchService } from '../search.service';

@Component({
  standalone: true,
  selector: 'app-filters-select-dialog',
  templateUrl: 'filters-select-dialog.component.html',
  styleUrls: ['./filters-select-dialog.component.scss'],
  imports: [
    FontAwesomeModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,
  ],
})
export class FiltersSelectDialogComponent implements OnInit {
  beneficiaryOptions: Array<{name: string, icon: IconDefinition}>;
  categoryOptions: Array<{name: string, icon: IconDefinition}>;
  countryOptions: string[];

  constructor(public search: SearchService) {}

  ngOnInit() {
    this.beneficiaryOptions = CampaignGroupsService.getBeneficiaries();
    this.categoryOptions = CampaignGroupsService.getCategories();
    this.countryOptions = CampaignGroupsService.getCountries();
  }

  setFilter(filterName: string, value: string) {
    this.search.filter(filterName, value);
  }
}
