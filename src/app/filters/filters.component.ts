import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';

import { CampaignService } from '../campaign.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent implements OnInit {
  @Input() hasTerm: boolean;
  @Output() filterApplied: EventEmitter<any> = new EventEmitter();
  @Output() sortApplied: EventEmitter<any> = new EventEmitter();
  @Input() @Output() selectedSort: any;

  public beneficiaryOptions: string[];
  public categoryOptions: string[];
  public countryOptions: string[];

  constructor(private campaignService: CampaignService) {
    this.beneficiaryOptions = campaignService.getBeneficiaries();
    this.categoryOptions = campaignService.getCategories();
    this.countryOptions = campaignService.getCountries();
  }

  ngOnInit() {
  }

  setFilter(filterName, event) {
    this.filterApplied.emit({filterName, value: event.value});
  }

  setSortField(event) {
    this.sortApplied.emit(event.value);
  }
}
