import { Component, Input, OnInit } from '@angular/core';
import { Campaign } from 'src/app/campaign.model';
import {ImageService} from "../../image.service";
import {CurrencyPipe, DatePipe, getCurrencySymbol, isPlatformBrowser} from '@angular/common';
import { CampaignService } from '../../campaign.service';
import {TimeLeftPipe} from "../../time-left.pipe";
import { Donation } from '../../donation.model';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-donation-start-secondary',
  templateUrl: './donation-start-secondary.component.html',
  styleUrls: ['./donation-start-secondary.component.scss'],
  providers: [ 
    CurrencyPipe,
    TimeLeftPipe,
    DatePipe
  ]
})
export class DonationStartSecondaryComponent implements OnInit {

  @Input() campaign: Campaign;
  /**
   * TODO: send the initalised reference from child component
   * or remove the html part that requires reservationExpiryTime()
  */ 
  @Input() donation: Donation;

  bannerUri: string | null;
  campaignRaised: string; // Formatted
  campaignTarget: string; // Formatted
  campaignFinished: boolean;
  campaignOpen: boolean;

  constructor(
    private imageService: ImageService,
    private currencyPipe: CurrencyPipe,
    public datePipe: DatePipe,
    public timeLeftPipe: TimeLeftPipe
  ) {}

  ngOnInit() {
    if(this.campaign) {
      this.imageService.getImageUri(this.campaign.bannerUri, 830).subscribe(uri => this.bannerUri = uri);

      this.campaignRaised = this.currencyPipe.transform(this.campaign.amountRaised, this.campaign.currencyCode, 'symbol', '1.0-0') as string;
      this.campaignTarget = this.currencyPipe.transform(this.campaign.target, this.campaign.currencyCode, 'symbol', '1.0-0') as string;
      this.campaignOpen = CampaignService.isOpenForDonations(this.campaign);
      this.campaignFinished = CampaignService.isInPast(this.campaign);
    }
  }

  getPercentageRaised(campaign: Campaign): number | undefined {
    return CampaignService.percentRaised(campaign);
  }

  reservationExpiryTime(): Date | undefined {
    if (!this.donation?.createdTime || !this.donation.matchReservedAmount) {
      return undefined;
    }

    return new Date(environment.reservationMinutes * 60000 + (new Date(this.donation.createdTime)).getTime());
  }
}
