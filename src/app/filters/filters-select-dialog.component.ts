import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { IconDefinition } from '@fortawesome/free-brands-svg-icons';
import { Observable, Subscription } from 'rxjs';

import { CampaignGroupsService } from '../campaign-groups.service';
import { FiltersComponent, FilterType, SelectedType } from './filters.component';

@Component({
  selector: 'app-filters-select-dialog',
  templateUrl: 'filters-select-dialog.component.html',
  styleUrls: ['./filters-select-dialog.component.scss'],
})
export class FiltersSelectDialogComponent implements OnDestroy, OnInit {
  @Input() reset: Observable<void>;
  @Input() selected: SelectedType;
  @Input() setFilter: (filterName: FilterType, event: { value: string }) => void;
  @Output() filterApplied: EventEmitter<any> = new EventEmitter();

  beneficiaryOptions: Array<{name: string, icon: IconDefinition}>;
  categoryOptions: Array<{name: string, icon: IconDefinition}>;
  countryOptions: string[];

  private resetSubscription: Subscription;

  constructor() {}

  ngOnInit() {
    this.beneficiaryOptions = CampaignGroupsService.getBeneficiaries();
    this.categoryOptions = CampaignGroupsService.getCategories();
    this.countryOptions = CampaignGroupsService.getCountries();

    this.resetSubscription = this.reset.subscribe(() => {
      this.selected = FiltersComponent.selectedDefaults();
    });
  }

  ngOnDestroy() {
    this.resetSubscription.unsubscribe();
  }
}
