import {Component, Inject, Input, OnInit} from '@angular/core';
import { Campaign } from 'src/app/campaign.model';
import {ImageService} from "../../image.service";
import {CurrencyPipe, DatePipe,} from '@angular/common';
import { CampaignService } from '../../campaign.service';
import {TimeLeftPipe} from "../../time-left.pipe";
import {CampaignGroupsService} from "../../campaign-groups.service";

const openPipeToken = 'TimeLeftToOpenPipe';
const endPipeToken = 'timeLeftToEndPipe';

@Component({
  selector: 'app-donation-start-secondary',
  templateUrl: './donation-start-secondary.component.html',
  styleUrls: ['./donation-start-secondary.component.scss'],
  providers: [
    CurrencyPipe,
    // TimeLeftPipes are stateful, so we need to use a separate pipe for each date.
    {provide: openPipeToken, useClass: TimeLeftPipe},
    {provide: endPipeToken, useClass: TimeLeftPipe},
    DatePipe
  ]
})
export class DonationStartSecondaryComponent implements OnInit {

  @Input({ required: true }) campaign: Campaign;

  bannerUri: string | null;
  campaignRaised: string; // Formatted
  campaignTarget: string; // Formatted
  campaignFinished: boolean;
  campaignOpen: boolean;

  constructor(
    private imageService: ImageService,
    private currencyPipe: CurrencyPipe,
    public datePipe: DatePipe,
    @Inject(openPipeToken) public timeLeftToOpenPipe: TimeLeftPipe,
    @Inject(endPipeToken) public timeLeftToEndPipe: TimeLeftPipe,
  ) {}

  ngOnInit() {
    if(this.campaign) {
      this.imageService.getImageUri(this.campaign.bannerUri, 830).subscribe(uri => this.bannerUri = uri);

      // This block of code is copied from campaign-info.component. Apologies for duplication.
      this.campaignRaised = this.currencyPipe.transform(this.campaign.amountRaised, this.campaign.currencyCode, 'symbol', '1.0-0') as string;
      this.campaignTarget = this.currencyPipe.transform(this.campaign.target, this.campaign.currencyCode, 'symbol', '1.0-0') as string;
      this.campaignOpen = CampaignService.isOpenForDonations(this.campaign);
      this.campaignFinished = CampaignService.isInPast(this.campaign);
    }
  }

  getPercentageRaised(campaign: Campaign): number | undefined {
    return CampaignService.percentRaised(campaign);
  }

  // Three functions below copied from campaign-info.component. Apologies for duplication.
  getBeneficiaryIcon(beneficiary: string) {
    return CampaignGroupsService.getBeneficiaryIcon(beneficiary);
  }

  getCategoryIcon(category: string) {
    return CampaignGroupsService.getCategoryIcon(category);
  }
}
