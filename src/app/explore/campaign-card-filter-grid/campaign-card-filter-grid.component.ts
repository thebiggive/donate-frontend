import {Component, inject, Input} from '@angular/core';
import {SearchService} from "../../search.service";
import {COUNTRY_CODE} from "../../country-code.token";
import {CampaignService} from "../../campaign.service";
import {CampaignSummary} from "../../campaign-summary.model";

@Component({
  selector: 'app-campaign-card-filter-grid',
  imports: [],
  templateUrl: './campaign-card-filter-grid.component.html',
  styleUrl: './campaign-card-filter-grid.component.scss',
})
export class CampaignCardFilterGridComponent {
  @Input() categoryOptions: "categoryOptions";
  @Input() beneficiaryOptions: "beneficiaryOptions";
  @Input() locationOptions: "locationOptions";
  @Input() searchService: "searchService.selectedSortLabel";
  @Input() flags: "flags.enableSearchByLocation";
  @Input() this
  @Input() location: "location";
  @Input() fetchingLocation: "fetchingLocation";
  @Input() onScroll: "onScroll()";
  @Input() currencyPipeDigitsInfo: any;
  @Input() isInFuture: "isInFuture(campaign)";
  @Input() isInPast: "isInPast(campaign)";
  @Input() getRelevantDateAsStr: "getRelevantDateAsStr(campaign)";
  @Input() getPercentageRaised: "campaign.isRegularGiving ? null : getPercentageRaised(campaign)";
}
