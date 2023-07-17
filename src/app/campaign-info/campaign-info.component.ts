import { CurrencyPipe, DatePipe } from '@angular/common';
import {Component, Inject, Input, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CampaignGroupsService } from '../campaign-groups.service';
import { Campaign } from '../campaign.model';
import { CampaignService } from '../campaign.service';
import { TimeLeftPipe } from '../time-left.pipe';

const openPipeToken = 'TimeLeftToOpenPipe';
const endPipeToken = 'timeLeftToEndPipe';

@Component({
  selector: 'app-campaign-info',
  templateUrl: './campaign-info.component.html',
  styleUrls: ['./campaign-info.component.scss'],
  providers: [
    CurrencyPipe,
    // TimeLeftPipes are stateful, so we need to use a separate pipe for each date.
    {provide: openPipeToken, useClass: TimeLeftPipe},
    {provide: endPipeToken, useClass: TimeLeftPipe},
  ],
})
export class CampaignInfoComponent implements OnInit {
  additionalImageUris: Array<string|null> = [];
  @Input({ required: true }) campaign: Campaign;
  campaignOpen: boolean;
  campaignFinished: boolean;
  campaignRaised: string; // Formatted
  campaignTarget: string; // Formatted

  constructor(
    private currencyPipe: CurrencyPipe,
    public datePipe: DatePipe,
    private route: ActivatedRoute,
    @Inject(openPipeToken) public timeLeftToOpenPipe: TimeLeftPipe,
    @Inject(endPipeToken) public timeLeftToEndPipe: TimeLeftPipe,
  ) {
  }

  ngOnInit() {
    this.campaign = this.route.snapshot.data.campaign;
    this.campaignOpen = CampaignService.isOpenForDonations(this.campaign);
    this.campaignFinished = CampaignService.isInPast(this.campaign);
    this.campaignTarget = this.currencyPipe.transform(this.campaign.target, this.campaign.currencyCode, 'symbol', '1.0-0') as string;
    this.campaignRaised = this.currencyPipe.transform(this.campaign.amountRaised, this.campaign.currencyCode, 'symbol', '1.0-0') as string;
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
