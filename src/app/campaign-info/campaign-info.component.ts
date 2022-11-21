import { CurrencyPipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { CampaignGroupsService } from '../campaign-groups.service';
import { Campaign } from '../campaign.model';
import { CampaignService } from '../campaign.service';
import { TimeLeftPipe } from '../time-left.pipe';

@Component({
  selector: 'app-campaign-info',
  templateUrl: './campaign-info.component.html',
  styleUrls: ['./campaign-info.component.scss'],
  providers: [
    CurrencyPipe,
    TimeLeftPipe,
  ],
})
export class CampaignInfoComponent implements OnInit {
  additionalImageUris: Array<string|null> = [];
  @Input() campaign: Campaign;
  campaignOpen: boolean;
  campaignRaised: string; // Formatted
  campaignTarget: string; // Formatted
  isPendingOrNotReady = false;
  campaignInFuture = false;
  donateEnabled = true;
  fromFund = false;
  percentRaised?: number;
  videoEmbedUrl?: SafeResourceUrl;

  constructor(
    private currencyPipe: CurrencyPipe,
    private route: ActivatedRoute,
    public timeLeftPipe: TimeLeftPipe,
  ) {
  }

  ngOnInit() {
    this.campaign = this.route.snapshot.data.campaign;
    this.campaignOpen = CampaignService.isOpenForDonations(this.campaign);
    this.campaignTarget = this.currencyPipe.transform(this.campaign.target, this.campaign.currencyCode, 'symbol', '1.0-0') as string;
    this.campaignRaised = this.currencyPipe.transform(this.campaign.amountRaised, this.campaign.currencyCode, 'symbol', '1.0-0') as string;
  }


  getStringDate(date: string) {
    const theDate: Date = new Date(date);
    return theDate.toDateString();
  }

  getPercentageRaised(campaign: Campaign): number | undefined {
    return CampaignService.percentRaised(campaign);
  }

  getBeneficiaryIcon(beneficiary: string) {
    return CampaignGroupsService.getBeneficiaryIcon(beneficiary);
  }

  getCategoryIcon(category: string) {
    return CampaignGroupsService.getCategoryIcon(category);
  }

}
