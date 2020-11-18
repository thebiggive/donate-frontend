import { Component, OnInit } from '@angular/core';
import { IconDefinition } from '@fortawesome/free-brands-svg-icons';

import { CampaignGroupsService } from '../campaign-groups.service';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-filters-select-dialog',
  templateUrl: 'filters-select-dialog.component.html',
  styleUrls: ['./filters-select-dialog.component.scss'],
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
