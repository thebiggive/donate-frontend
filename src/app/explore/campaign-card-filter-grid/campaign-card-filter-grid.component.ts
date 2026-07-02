import { Component, inject, Input } from '@angular/core';
import { SearchService } from '../../search.service';
import { COUNTRY_CODE } from '../../country-code.token';
import { flags } from '../../featureFlags';
import { BiggiveCampaignCardFilterGrid } from '@biggive/components-angular';

@Component({
  selector: 'app-campaign-card-filter-grid',
  imports: [BiggiveCampaignCardFilterGrid],
  templateUrl: './campaign-card-filter-grid.component.html',
  styleUrl: './campaign-card-filter-grid.component.scss',
})
export class CampaignCardFilterGridComponent {
  @Input() categoryOptions: string[] = [];
  @Input() beneficiaryOptions: string[] = [];
  @Input() locationOptions: string[] = [];
  searchService = inject(SearchService);
  flags = flags;
  @Input() clientCountryCode = inject(COUNTRY_CODE, { optional: true });
  @Input() location: GeolocationPosition | undefined;
  @Input() fetchingLocation: boolean = false;
  @Input() currencyPipeDigitsInfo: string | undefined;
}
