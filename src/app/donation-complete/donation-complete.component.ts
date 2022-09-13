import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';

import { AnalyticsService } from '../analytics.service';
import { Campaign } from '../campaign.model';
import { CampaignService } from '../campaign.service';
import { Donation } from '../donation.model';
import { DonationCompleteSetPasswordDialogComponent } from './donation-complete-set-password-dialog.component';
import { DonationService } from '../donation.service';
import { IdentityService } from '../identity.service';
import { PageMetaService } from '../page-meta.service';
import { Person } from '../person.model';

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
  public giftAidAmount: number;
  public noAccess = false;
  offerToSetPassword = false;
  public prefilledText: string;
  public timedOut = false;
  public totalValue: number;
  public shareUrl: string;

  private donationId: string;
  private maxTries = 5;
  private person?: Person;
  private retryInterval = 2; // In seconds
  private tries = 0;

  constructor(
    private analyticsService: AnalyticsService,
    private campaignService: CampaignService,
    public dialog: MatDialog,
    private donationService: DonationService,
    private identityService: IdentityService,
    private pageMeta: PageMetaService,
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
    this.donationService.removeOldLocalDonations();

    this.tries++;
    const donationLocalCopy = this.donationService.getDonation(this.donationId);

    if (donationLocalCopy === undefined) {
      this.analyticsService.logError('thank_you_no_local_copy', `Donation ID ${this.donationId}`);
      this.noAccess = true; // If we don't have the local auth token we can never load the details.
      return;
    }

    this.donationService.get(donationLocalCopy).subscribe(
      donation => this.setDonation(donation),
      // Get error may occur e.g. after a DB reset; unlikely recoverable within the
      // page view so treat it like a timeout. Error message encourages donors to
      // refresh to try loading again when any server problem's resolved.
      () => this.timedOut = true,
    );
  }

  openSetPasswordDialog() {
    const passwordSetDialog = this.dialog.open(DonationCompleteSetPasswordDialogComponent, {
      data: { person: this.person },
      role: 'alertdialog',
    });
    passwordSetDialog.afterClosed().subscribe({
      next: (password: string) => this.setPassword(password),
    });
  }

  setPassword(password: string) {
    if (!this.person) {
      console.log('Cannot set password without a person'); // TODO probably GA log and report to donor.
      return;
    }

    this.person.raw_password = password;
    this.identityService.update(this.person);
  }

  private setDonation(donation: Donation) {
    if (donation === undefined) {
      this.analyticsService.logError('thank_you_lookup_failed', `Donation ID ${this.donationId}`);
      this.noAccess = true; // If we don't have the local auth token we can never load the details.
      return;
    }

    if (environment.identityEnabled) {
      this.identityService.update(this.buildPersonFromDonation(donation))
        .subscribe(person => {
          this.person = person;
          this.offerToSetPassword = !person.has_password;
        });
    }

    this.donation = donation;
    this.campaignService.getOneById(donation.projectId).subscribe(campaign => {
      this.campaign = campaign;
      this.pageMeta.setCommon(
        `${campaign.charity.name}`,
        `Thanks for donating to the "${campaign.title}" campaign`,
        campaign.currencyCode !== 'GBP',
        campaign.bannerUri,
      );
      this.setSocialShares(campaign);
    });

    if (donation && this.donationService.isComplete(donation)) {
      this.analyticsService.logEvent('thank_you_fully_loaded', `Donation to campaign ${donation.projectId}`);

      this.cardChargedAmount = donation.donationAmount + donation.feeCoverAmount + donation.tipAmount;
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

  private buildPersonFromDonation(donation: Donation): Person {
    let person: Person = {
      email_address: donation.emailAddress,
      first_name: donation.firstName,
      last_name: donation.lastName,
    };

    if (donation.giftAid) {
      person.home_address_line_1 = donation.homeAddress;
      person.home_postcode = donation.homePostcode === 'OVERSEAS' ? undefined : donation.homePostcode;
      person.home_country_code = donation.homePostcode === 'OVERSEAS' ? 'OVERSEAS' : 'GB';
    }

    return person;
  }

  private setSocialShares(campaign: Campaign) {
    const prefix = campaign.currencyCode === 'GBP'
      ? environment.donateUriPrefix
      : environment.donateGlobalUriPrefix;
    this.shareUrl = `${prefix}/campaign/${campaign.id}`;
    this.prefilledText = encodeURIComponent('I just donated to this campaign, please support their good cause by making a donation.');
  }
}
