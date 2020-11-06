import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';

import { AnalyticsService } from '../analytics.service';
import { Campaign } from '../campaign.model';
import { CampaignService } from '../campaign.service';
import { Donation } from '../donation.model';
import { DonationService } from '../donation.service';

@Component({
  selector: 'app-donation-complete',
  templateUrl: './donation-complete.component.html',
  styleUrls: ['./donation-complete.component.scss'],
})
export class DonationCompleteComponent {
  public campaign: Campaign;
  public cardChargedAmount: number;
  public complete = false;
  public donation: Donation;
  public prefilledText: string;
  public giftAidAmount: number;
  public noAccess = false;
  public timedOut = false;
  public totalValue: number;
  public shareUrl: string;

  private donationId: string;
  private maxTries = 5;
  private retryInterval = 2; // In seconds
  private tries = 0;

  constructor(
    private analyticsService: AnalyticsService,
    private campaignService: CampaignService,
    private donationService: DonationService,
    private route: ActivatedRoute,
  ) {
    route.params.pipe().subscribe(params => {
      this.donationId = params.donationId;
      this.checkDonation();
    });
  }

  /**
   * Must be public in order for re-tries to invoke it in an anonymous context.
   */
  checkDonation(): void {
    this.tries++;
    const donationLocalCopy = this.donationService.getDonation(this.donationId);

    if (donationLocalCopy === undefined) {
      this.analyticsService.logError('thank_you_no_local_copy', `Donation ID ${this.donationId}`);
      this.noAccess = true; // If we don't have the local auth token we can never load the details.
      return;
    }

    this.donationService.get(donationLocalCopy).subscribe(donation => this.setDonation(donation));
  }

  private setDonation(donation: Donation) {
    if (donation === undefined) {
      this.analyticsService.logError('thank_you_lookup_failed', `Donation ID ${this.donationId}`);
      this.noAccess = true; // If we don't have the local auth token we can never load the details.
      return;
    }

    this.donation = donation;
    this.campaignService.getOneById(donation.projectId).subscribe(campaign => {
      this.campaign = campaign;
      this.setSocialShares(campaign);
    });

    if (donation && this.donationService.isComplete(donation)) {
      this.analyticsService.logEvent('thank_you_fully_loaded', `Donation to campaign ${donation.projectId}`);

      this.cardChargedAmount = donation.donationAmount + donation.tipAmount;
      this.giftAidAmount = donation.giftAid ? 0.25 * donation.donationAmount : 0;
      this.totalValue = donation.donationAmount + this.giftAidAmount + donation.matchedAmount;
      this.complete = true;

      // Re-save the donation with its new status so we don't offer to resume it if the donor
      // goes back to the same campaign.
      this.donationService.updateLocalDonation(donation);

      return;
    }

    if (this.tries < this.maxTries) {
      // Use an anonymous function so `this` context works inside the callback.
      setTimeout(() => this.checkDonation(), this.retryInterval * 1000);
      return;
    }

    this.analyticsService.logError('thank_you_timed_out_pre_complete', `Donation to campaign ${donation.projectId}`);
    this.timedOut = true;
  }

  private setSocialShares(campaign: Campaign) {
    const now = Math.floor(new Date().getTime() / 1000.0);
    const ccStartTime = parseInt(`${environment.ccStartTime}`, 10);
    const ccEndTime = parseInt(`${environment.ccEndTime}`, 10);

    this.shareUrl = `${environment.donateUriPrefix}/campaign/${campaign.id}`;

    if (campaign.parentRef?.includes('christmas-challenge')) {
      this.prefilledText = encodeURIComponent('I just donated in #ChristmasChallenge20. From 1-8 December, your donation can be doubled. One donation, twice the impact. http://bit.ly/cc20thankyou');

      // During CC we share the meta campaign page, otherwise default is the charities campaign page.
      if (now >= ccStartTime && now < ccEndTime) {
        this.shareUrl = `${environment.donateUriPrefix}/${campaign.parentRef}`;
      }
    } else {
      this.prefilledText = encodeURIComponent('I just donated to this campaign, please support their good cause by making a donation.');
    }
  }
}
